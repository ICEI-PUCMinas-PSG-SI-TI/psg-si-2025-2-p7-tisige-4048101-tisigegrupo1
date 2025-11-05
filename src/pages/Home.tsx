import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Corrigindo a importação para o caminho relativo
import { supabase } from "../integrations/supabase/client"; 

/**
 * Componente Home (Dashboard Principal)
 * * Lógica de Negócio (Foco LGPD):
 * 1. Verifica se o usuário está logado (Dependência do RF1/Auth).
 * 2. Se logado, verifica se o consentimento inicial (RF3) já foi dado.
 * 3. Se o consentimento não foi dado, redireciona para a tela de consentimento.
 * 4. Se o consentimento foi dado, exibe esta tela com link para o Centro de Privacidade (RF6).
 */
export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkSessionAndConsentFlow();
  }, []);

  /**
   * Verifica a sessão do usuário e o fluxo de consentimento obrigatório.
   */
  const checkSessionAndConsentFlow = async () => {
    // 1. Verificar Autenticação
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log("Nenhuma sessão encontrada. Redirecionando para /auth.");
      navigate("/auth");
      return;
    }

    // Usuário está logado
    setUserEmail(session.user.email || null);

    // 2. Verificar se o Consentimento (RF3) já foi dado
    try {
      const { data: consentData, error: consentError } = await supabase
        .from("consent_log") // Tabela de consentimento
        .select("*", { count: 'exact', head: true }) // Apenas conta os registros
        .eq("table_id", session.user.id);

      if (consentError) {
        throw new Error(`Erro ao verificar consentimentos: ${consentError.message}`);
      }
      
      // 3. Lógica de Redirecionamento (RF3)
      if (consentData.length === 0 || !consentData) { 
        // Se NENHUM registro de consentimento existe para este usuário, força o fluxo RF3.
        console.log("Usuário logado, mas sem consentimento (RF3). Redirecionando para /consentimento.");
        navigate("/consentimento");
      } else {
        // Usuário logado E consentimento já existe. Pode ficar na Home.
        console.log("Usuário autenticado e consentimento (RF3) válido.");
        setLoading(false);
      }

    } catch (error) {
      console.error(error);
      // Se a tabela 'consents' não existir, o Supabase retornará um erro.
      // Neste caso, redirecionamos para o RF3 para criar os registros.
      if (error instanceof Error && (error.message.includes("relation") || error.message.includes("does not exist"))) {
        console.warn("Tabela 'consents' não encontrada. Redirecionando para /consentimento.");
        navigate("/consentimento");
      } else {
        setLoading(false); // Permite ao admin ver a tela mesmo se a lógica falhar.
      }
    }
  };

  /**
   * Lida com o logout do usuário.
   */
  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro no logout:", error);
      setLoading(false);
    } else {
      navigate("/auth");
    }
  };

  // Se estiver carregando (verificando auth e consentimento), mostra tela de loading
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Verificando sessão e consentimentos...</p>
      </div>
    );
  }

  // Se passou por todas as verificações, exibe a Home
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '50px auto', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
        Bar do Morcego - Dashboard
      </h1>
      
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Bem-vindo, {userEmail || "Usuário"}.
      </p>

      {/* Navegação para o RF6 (Centro de Privacidade) */}
      <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Gerenciamento LGPD (RF6)</h2>
        <p style={{ marginBottom: '15px' }}>
          Acesse o Centro de Privacidade para ver seus consentimentos, exportar seus dados ou solicitar a eliminação da sua conta.
        </p>
        <button 
          onClick={() => navigate("/privacy")}
          style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Acessar Centro de Privacidade (RF6)
        </button>
      </div>

      <button 
        onClick={handleLogout}
        style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
      >
        Sair (Logout)
      </button>

    </div>
  );
}
