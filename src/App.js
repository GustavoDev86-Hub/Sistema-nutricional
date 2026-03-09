import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('cliente'); 
  const [isAutenticado, setIsAutenticado] = useState(false); 
  const [novoPost, setNovoPost] = useState({ titulo: '', conteudo: '', tipo: 'artigo' });

  const SENHA_ACESSO = "nutri123"; 
  const API_URL = "http://localhost:8080/api/posts";

  const carregarPosts = () => {
    axios.get(API_URL)
      .then(res => setPosts(res.data))
      .catch(err => console.error("Erro ao conectar com o Java:", err));
  };

  useEffect(() => {
    carregarPosts();
  }, []);

  const fazerLogin = () => {
    const senha = prompt("Digite a senha da Área Administrativa:");
    if (senha === SENHA_ACESSO) {
      setIsAutenticado(true);
      setView('admin');
    } else {
      alert("Acesso Negado: Senha Incorreta!");
    }
  };

  const salvarPostagem = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('titulo', novoPost.titulo);
  formData.append('conteudo', novoPost.conteudo);
  formData.append('tipo', novoPost.tipo);
  formData.append('imagem', arquivoSelecionado); 

  axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(() => {
    alert("Publicado com Foto!");
    carregarPosts();
    setView('cliente');
  })
  .catch(err => console.error("Erro ao subir imagem:", err));
};

  const fazerLogout = () => {
    setIsAutenticado(false);
    setView('cliente');
  };

  return (
    <div style={styles.container}>
      {/* Barra de Navegação */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <h2 style={{ color: 'white', margin: 0 }}>Nutri App 🍎</h2>
          <div>
            <button onClick={() => setView('cliente')} style={styles.navButton}>Página Inicial</button>
            
            {!isAutenticado ? (
              <button onClick={fazerLogin} style={styles.adminButton}>Acesso Restrito</button>
            ) : (
              <>
                <button onClick={() => setView('admin')} style={styles.navButton}>Painel de Postagem</button>
                <button onClick={fazerLogout} style={styles.logoutButton}>Sair</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main style={styles.mainContent}>
        
        {/* VISÃO DO CLIENTE (Só vê os artigos) */}
        {view === 'cliente' && (
          <section>
            <h1 style={styles.title}>Blog de Nutrição</h1>
            {posts.length === 0 && <p style={{textAlign: 'center'}}>Nenhuma dica publicada ainda.</p>}
            {posts.map(post => (
              <div key={post.id} style={styles.card}>
                <span style={styles.tag}>{post.tipo}</span>
                <h2 style={styles.postTitle}>{post.titulo}</h2>
                <p style={styles.postContent}>{post.conteudo}</p>
              </div>
            ))}
          </section>
        )}

        {/* ÁREA DA NUTRI (Bloqueada) */}
        {view === 'admin' && isAutenticado && (
          <section style={styles.adminSection}>
            <h1 style={styles.title}>Nova Postagem</h1>
            <form onSubmit={salvarPostagem} style={styles.form}>
              <label>Título do Artigo:</label>
              <input 
                style={styles.input}
                value={novoPost.titulo}
                onChange={e => setNovoPost({...novoPost, titulo: e.target.value})}
                required
              />

              <label>Conteúdo/Dica:</label>
              <textarea 
                style={styles.textarea}
                value={novoPost.conteudo}
                onChange={e => setNovoPost({...novoPost, conteudo: e.target.value})}
                required
              />

              <label>Categoria:</label>
              <select 
                style={styles.input}
                value={novoPost.tipo}
                onChange={e => setNovoPost({...novoPost, tipo: e.target.value})}
              >
                <option value="artigo">Artigo Detalhado</option>
                <option value="dica">Dica Rápida</option>
              </select>

              <button type="submit" style={styles.submitButton}>Publicar Agora</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

// --- ESTILIZAÇÃO ---
const styles = {
  container: { backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' },
  navbar: { backgroundColor: '#27ae60', padding: '15px 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  navContent: { maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  navButton: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', marginRight: '15px' },
  adminButton: { backgroundColor: '#219150', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  logoutButton: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' },
  mainContent: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  title: { textAlign: 'center', color: '#2c3e50', marginBottom: '30px' },
  card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  tag: { backgroundColor: '#e8f5e9', color: '#27ae60', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
  postTitle: { color: '#27ae60', margin: '10px 0' },
  postContent: { color: '#7f8c8d', lineHeight: '1.6' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' },
  textarea: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', height: '150px', resize: 'vertical' },
  submitButton: { backgroundColor: '#27ae60', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }
};

export default App;
