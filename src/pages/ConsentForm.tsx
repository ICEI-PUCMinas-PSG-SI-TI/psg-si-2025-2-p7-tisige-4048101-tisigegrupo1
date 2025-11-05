import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Adapte o caminho abaixo para o seu arquivo de cliente Supabase
import { supabase } from "../integrations/supabase/client"; 

/**
 * Componente Mínimo para RF3: Consentimento LGPD Granular
 * Este componente coleta o aceite inicial do usuário.
 * * NOTA: Componentes de UI como Card, Button, Checkbox aguardando desenvolvimento de UI.
 */
export default function ConsentForm() {
  const navigate = useNavigate();
  // CRITÉRIO RF3: Checkboxes NÃO pré-marcadas (estado inicial false)
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [loyaltyConsent, setLoyaltyConsent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const policyVersion = "1.0.0"; // Versão da Política LGPD

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  /**
   * Verifica a autenticação e carrega o User ID
   */
  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("Usuário não autenticado. Redirecionando para login.");
      // Não usamos 'toast' pois a dependência foi removida
      navigate("/auth");
      return;
    }
    setUserId(session.user.id);
  };

  /**
   * Salva os dois tipos de consentimento no banco de dados.
   * Garante a auditoria completa (IP, timestamp, versão).
   */
  const handleSaveConsents = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || isSubmitting) {
        console.error("Erro: Usuário não autenticado ou submissão em andamento.");
        return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Coleta o IP para Auditoria (Permanece)
      // Esta API é mockada no teste de Insomnia
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();
      
      const consentsToSave = [
        // CRITÉRIO: Salvar 'marketing'
        { user_id: userId, consent_type: "marketing", granted: marketingConsent, ip_address: ip, policyVersion },
        // CRITÉRIO: Salvar 'fidelidade'
        { user_id: userId, consent_type: "fidelidade", granted: loyaltyConsent, ip_address: ip, policyVersion },
      ];

      // 2. Salva em lote no Supabase
      const { error } = await supabase.from("consents").insert(consentsToSave);

      if (error) throw error;
      
      console.log("Consentimentos salvos com sucesso! Redirecionando para a Home.");
      // Usamos console.log no lugar de 'toast'
      navigate("/"); // Redireciona para a Home após o aceite
    } catch (error) {
      console.error("Erro ao salvar consentimentos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Consentimento LGPD (RF3)</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Interface Mínima para demonstração.
      </p>
      
      <form onSubmit={handleSaveConsents} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Checkbox 1: Marketing (CRITÉRIO: Não pré-marcado) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="marketing"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          <label htmlFor="marketing">Desejo receber comunicações de marketing</label>
        </div>
        
        {/* Checkbox 2: Fidelidade (CRITÉRIO: Não pré-marcado) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            id="fidelidade"
            checked={loyaltyConsent}
            onChange={(e) => setLoyaltyConsent(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          <label htmlFor="fidelidade">Desejo participar do programa de fidelidade</label>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ padding: '10px', background: isSubmitting ? '#aaa' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          {isSubmitting ? "Salvando..." : "Salvar Consentimentos"}
        </button>
      </form>
      
      <p style={{ marginTop: '15px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
        Versão da Política: {policyVersion}. Todos os registros são auditáveis (IP/Timestamp).
      </p>
    </div>
  );
}
