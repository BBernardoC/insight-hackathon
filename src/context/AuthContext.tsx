import React, { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  username: string;
  role: "admin" | "professor" | "geral";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// ================= USUÁRIOS DE TESTE =================
const TEST_USERS: Record<string, User> = {
  admin: {
    username: "admin",
    role: "admin",
  },
  professor: {
    username: "professor",
    role: "professor",
  },
  geral: {
    username: "usuario",
    role: "geral",
  },
};

// ================= CONFIGURAÇÃO =================
const USE_TEST_MODE = true; // Mude para false em produção
const DEFAULT_USER = TEST_USERS.admin; // Escolha qual usar por padrão

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Se estiver em modo teste, usa o usuário padrão
    if (USE_TEST_MODE) {
      return DEFAULT_USER;
    }

    // Caso contrário, tenta pegar do localStorage
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (username: string, role: string) => {
    // ✅ MODO TESTE: Verifica se é um usuário de teste
    if (USE_TEST_MODE && TEST_USERS[username]) {
      const testUser = TEST_USERS[username];
      setUser(testUser);
      localStorage.setItem("user", JSON.stringify(testUser));
      return;
    }

    // Modo normal: cria o usuário com os dados fornecidos
    const newUser: User = {
      username,
      role: role as "admin" | "professor" | "geral",
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    // Se estiver em modo teste, volta para o usuário padrão
    if (USE_TEST_MODE) {
      setUser(DEFAULT_USER);
      localStorage.removeItem("user");
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ================= COMO USAR OS USUÁRIOS DE TESTE =================
/*
1. Em qualquer componente, você pode fazer login assim:

// Login como Admin
login("admin", "admin");

// Login como Professor
login("professor", "professor");

// Login como Usuário Geral
login("geral", "geral");


2. Exemplo de componente de seleção rápida:

function QuickUserSelector() {
  const { login, user } = useAuth();
  
  return (
    <div>
      <p>Usuário atual: {user?.username} ({user?.role})</p>
      <button onClick={() => login("admin", "admin")}>Admin</button>
      <button onClick={() => login("professor", "professor")}>Professor</button>
      <button onClick={() => login("geral", "geral")}>Geral</button>
    </div>
  );
}


3. Para testar diferentes roles rapidamente no console:

// No console do navegador:
// Para trocar para admin:
localStorage.setItem('user', JSON.stringify({username: 'admin', role: 'admin'}));
window.location.reload();

// Para trocar para professor:
localStorage.setItem('user', JSON.stringify({username: 'professor', role: 'professor'}));
window.location.reload();


4. Você também pode criar um atalho de teclado para trocar:

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey) {
      if (e.key === '1') login("admin", "admin");
      if (e.key === '2') login("professor", "professor");
      if (e.key === '3') login("geral", "geral");
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);

// Ctrl+Shift+1 = Admin
// Ctrl+Shift+2 = Professor
// Ctrl+Shift+3 = Geral
*/
