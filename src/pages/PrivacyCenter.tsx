import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Adaptando importações para remover dependências de UI quebradas
import { supabase } from "../integrations/supabase/client"; 

/**
 * Privacy Center - FR6 Implementation (Versão Mínima para Lógica Backend)
 * Foco: Funcionalidades de gerenciamento de dados do titular (ver/exportar/eliminar).
 * NOTA: Componentes UI pendentes.
 */
export default function PrivacyCenter() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState(""); // Usado no lugar de toast
  
  // Consent states
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [marketingWhatsApp, setMarketingWhatsApp] = useState(false);
  const [loyaltyConsent, setLoyaltyConsent] = useState(false);
  
  // User data for display
  const [, setProfile] = useState<any>(null);
  const [hasErasureRequest, setHasErasureRequest] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verify user authentication and load data
   */
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("Please log in to access Privacy Center");
      navigate("/auth");
      return;
    }

    setUserId(session.user.id);
    await loadUserData(session.user.id);
  };

  /**
   * Load user profile and consent preferences
   */
  const loadUserData = async (uid: string) => {
    try {
      // Load profile (mantido para exibição básica e consistência)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();

      // Permitimos que o profileError falhe silenciosamente, pois a tabela pode não existir ainda
      if (profileData) {
        setProfile(profileData);
      }

      // Load consents (RF6: Ver consentimentos)
      const { data: consentsData, error: consentsError } = await supabase
        .from("consents")
        .select("*")
        .eq("user_id", uid);

      if (consentsError) throw consentsError;

      // Set consent states
      consentsData.forEach((consent: any) => {
        switch (consent.consent_type) {
          case "marketing_email":
            setMarketingEmail(consent.granted);
            break;
          case "marketing_whatsapp":
            setMarketingWhatsApp(consent.granted);
            break;
          // Ajustado para corresponder ao ConsentForm.tsx
          case "fidelidade": 
            setLoyaltyConsent(consent.granted);
            break;
          case "loyalty": // Mantendo compatibilidade
            setLoyaltyConsent(consent.granted);
            break;
        }
      });

      // Check for existing erasure request (RF6: Solicitar Eliminação)
      // NOTE: Este teste exige que você crie a tabela 'erasure_requests' no seu DB.
      // Se a tabela não existir, a query falhará.
      try {
        const { data: erasureData } = await supabase
          .from("erasure_requests")
          .select("*")
          .eq("user_id", uid)
          .in("status", ["pending", "confirmed", "processing"])
          .maybeSingle();
        setHasErasureRequest(!!erasureData);
      } catch (e) {
        console.warn("Tabela 'erasure_requests' não encontrada. Pulando verificação de eliminação.");
        setHasErasureRequest(false);
      }

    } catch (error: any) {
      console.error("Error loading user data:", error);
      setMessage("Error loading your data. Check console.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates a specific consent preference (RF6: Alterar consentimentos)
   * Captures IP and timestamp for audit trail
   */
  const updateConsent = async (consentType: string, granted: boolean) => {
    if (!userId) return;

    try {
      // Get IP address for audit
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      // NOTA: A lógica correta aqui é 'UPSERT' (Update or Insert)
      // Isso garante que, se o registro não existir, ele seja criado.
      // Se já existir, ele é atualizado.
      const { error } = await supabase
        .from("consents")
        .upsert({
          user_id: userId,
          consent_type: consentType,
          granted: granted,
          timestamp: new Date().toISOString(),
          ip_address: ip,
          policy_version: "1.0.1", // Nova versão para auditoria de alteração
        }, 
        { onConflict: 'user_id, consent_type' } // Chave de conflito para o UPSERT
      );

      if (error) throw error;

      setMessage(`Consentimento '${consentType}' atualizado para ${granted}.`);
    } catch (error: any) {
      console.error("Error updating consent:", error);
      setMessage(`Erro ao atualizar preferência: ${error.message}`);
      
      // Revert UI state on error
      switch (consentType) {
        case "marketing_email":
          setMarketingEmail(!granted);
          break;
        case "marketing_whatsapp":
          setMarketingWhatsApp(!granted);
          break;
        case "fidelidade":
          setLoyaltyConsent(!granted);
          break;
      }
    }
  };

  /**
   * Exports user data (RF6: Exportar dados)
   * Simula a chamada para uma Edge Function (seu próximo passo de backend)
   */
  const handleDataExport = async (format: "json" | "csv") => {
    if (!userId) return;

    try {
      setMessage(`Preparando exportação ${format.toUpperCase()}...`);

      // NOTA: Para fins de teste, este bloco apenas simula o que a Edge Function faria.
      // Você precisa criar a Edge Function 'export-user-data' no Supabase CLI.
      const { data, error } = await supabase.functions.invoke("export-user-data", {
         // O corpo JSON enviado para a Edge Function
         body: { user_id: userId, format },
      });

      if (error) throw error;
      
      // Simulação de download: A função Edge Function deve retornar os dados formatados
      const formattedData = data.data || "Nenhum dado encontrado ou Edge Function não implementada.";

      const blob = new Blob([format === "json" ? JSON.stringify(formattedData, null, 2) : formattedData], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      
      // Inicia o download (mantém a lógica mínima de navegador)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bar-do-morcego-data-${new Date().toISOString().split("T")[0]}.${format}`;
      link.click();
      window.URL.revokeObjectURL(url);

      setMessage(`Dados exportados com sucesso como ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error("Export error:", error);
      setMessage(`Erro na exportação: ${error.message}. Verifique sua Edge Function.`);
    }
  };

  /**
   * Requests data erasure (RF6: Solicitar Eliminação)
   */
  const handleErasureRequest = async () => {
    if (!userId || hasErasureRequest) return;

    // Substituindo o AlertDialog por um window.confirm()
    const confirmation = window.confirm(
      "ATENÇÃO: Você está solicitando a exclusão permanente dos seus dados.\n" +
      "Em produção, você receberá uma confirmação por WhatsApp.\n" +
      "Esta ação não pode ser desfeita. Confirma?"
    );
    
    if (!confirmation) return;

    try {
      // 1. Cria o registro de solicitação
      const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error } = await supabase
        .from("erasure_requests") // Tabela para gerenciar solicitações de exclusão
        .insert({
          user_id: userId,
          status: "pending",
          confirmation_code: confirmationCode,
        });

      if (error) throw error;

      setHasErasureRequest(true);
      setMessage(
        `Solicitação de exclusão enviada. Código: ${confirmationCode}. Em produção, você receberia uma confirmação por WhatsApp.`
      );

      // 2. Chama a Edge Function para iniciar o fluxo (simulando o job)
      await supabase.functions.invoke("request-erasure", {
         body: { confirmation_code: confirmationCode },
      });
      
    } catch (error: any) {
      console.error("Erasure request error:", error);
      setMessage("Erro ao enviar solicitação de exclusão.");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
        <p>Carregando Centro de Privacidade...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <button onClick={() => navigate("/")} style={{ marginBottom: '20px', padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        ← Voltar para Home
      </button>

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Centro de Privacidade (RF6)</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Gerencie seus dados e preferências | Usuário ID: {userId}
      </p>

      {message && (
        <p style={{ padding: '10px', background: message.startsWith('Erro') ? '#ffe6e6' : '#e6ffe6', borderLeft: message.startsWith('Erro') ? '3px solid red' : '3px solid green', marginBottom: '15px' }}>
          {message}
        </p>
      )}

      {/* Gerenciamento de Consentimento (Ver e Alterar) */}
      <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>1. Gerenciamento de Consentimentos</h2>
        
        {/* Consent Email */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <div>
            <label htmlFor="mkt-email">Marketing por E-mail</label>
            <p style={{ fontSize: '12px', color: '#999' }}>Receber ofertas promocionais.</p>
          </div>
          <input
            type="checkbox"
            id="mkt-email"
            checked={marketingEmail}
            onChange={(e) => {
              setMarketingEmail(e.target.checked);
              updateConsent("marketing_email", e.target.checked);
            }}
          />
        </div>

        {/* Consent WhatsApp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <div>
            <label htmlFor="mkt-wa">Marketing por WhatsApp</label>
            <p style={{ fontSize: '12px', color: '#999' }}>Receber ofertas via WhatsApp.</p>
          </div>
          <input
            type="checkbox"
            id="mkt-wa"
            checked={marketingWhatsApp}
            onChange={(e) => {
              setMarketingWhatsApp(e.target.checked);
              updateConsent("marketing_whatsapp", e.target.checked);
            }}
          />
        </div>

        {/* Consent Fidelidade */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          <div>
            <label htmlFor="loyalty">Programa de Fidelidade</label>
            <p style={{ fontSize: '12px', color: '#999' }}>Participar do programa de recompensas.</p>
          </div>
          <input
            type="checkbox"
            id="loyalty"
            checked={loyaltyConsent}
            onChange={(e) => {
              setLoyaltyConsent(e.target.checked);
              // Corrigindo para usar 'fidelidade' como no ConsentForm
              updateConsent("fidelidade", e.target.checked);
            }}
          />
        </div>
      </div>
      
      {/* Exportação de Dados */}
      <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>2. Exportar Seus Dados (JSON/CSV)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => handleDataExport("json")} 
            style={{ padding: '10px', background: '#00cc66', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Exportar como JSON
          </button>
          <button 
            onClick={() => handleDataExport("csv")} 
            style={{ padding: '10px', background: '#33ccff', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Exportar como CSV
          </button>
        </div>
      </div>

      {/* Eliminação de Dados */}
      <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>3. Solicitar Eliminação de Dados</h2>
        {hasErasureRequest ? (
          <p style={{ color: 'orange' }}>Solicitação de exclusão pendente. Verifique o WhatsApp para confirmação.</p>
        ) : (
          <button 
            onClick={handleErasureRequest} 
            style={{ padding: '10px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Solicitar Exclusão Permanente
          </button>
        )}
      </div>
    </div>
  );
}