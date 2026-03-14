import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('cliente'); 
  const [isAutenticado, setIsAutenticado] = useState(false); 
  const [novoPost, setNovoPost] = useState({ titulo: '', conteudo: '', tipo: 'artigo' });
  const [arquivo, setArquivo] = useState(null); 

  const SENHA_ACESSO = "nutri123"; 
  const API_URL = "http://localhost:8080/posts";

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

  const fazerLogout = () => {
    setIsAutenticado(false);
    setView('cliente');
  };

  const salvarPostagem = (e) => {
    e.preventDefault();

    // Verificação de segurança para o arquivo
    if (!arquivo) {
        alert("Por favor, selecione uma imagem antes de publicar!");
        return;
    }

    const formData = new FormData();
    formData.append('titulo', novoPost.titulo);
    formData.append('conteudo', novoPost.conteudo);
    formData.append('tipo', novoPost.tipo); // No seu Java está @RequestParam("tipo")
    formData.append('imagem', arquivo);   // No seu Java está @RequestParam("imagem")

    axios.post(API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      alert("Postagem com foto publicada! 📸");
      setNovoPost({ titulo: '', conteudo: '', tipo: 'artigo' });
      setArquivo(null); 
      carregarPosts();
      setView('cliente');
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao subir: Verifique se o servidor Java está rodando.");
    });
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

      <main style={styles.mainContent}>
        {/* VISÃO DO CLIENTE */}
        {view === 'cliente' && (
          <section>
            <h1 style={styles.title}>Blog de Nutrição</h1>
            {posts.length === 0 && <p style={{textAlign: 'center'}}>Nenhuma dica publicada ainda.</p>}
            {posts.map(post => (
              <div key={post.id} style={styles.card}>
                <span style={styles.tag}>{post.tipo}</span>
                <h2 style={styles.postTitle}>{post.titulo}</h2>
                <p style={styles.postContent}>{post.conteudo}</p>
                {/* Aqui você pode adicionar a exibição da imagem se o back-end retornar a URL */}
              </div>
            ))}
          </section>
        )}

        {/* ÁREA DA NUTRI (Bloqueada) */}
        {view === 'admin' && isAutenticado && (
          <section style={styles.adminSection}>
            <h1 style={styles.title}>Nova Postagem</h1>
            <form onSubmit={salvarPostagem} style={styles.form}>
              <label style={styles.label}>Título do Artigo:</label>
              <input 
                style={styles.input}
                value={novoPost.titulo}
                onChange={e => setNovoPost({...novoPost, titulo: e.target.value})}
                required
              />

              <label style={styles.label}>Conteúdo/Dica:</label>
              <textarea 
                style={styles.textarea}
                value={novoPost.conteudo}
                onChange={e => setNovoPost({...novoPost, conteudo: e.target.value})}
                required
              />

              <label style={styles.label}>Categoria:</label>
              <select 
                style={styles.input}
                value={novoPost.tipo}
                onChange={e => setNovoPost({...novoPost, tipo: e.target.value})}
              >
                <option value="artigo">Artigo Detalhado</option>
                <option value="dica">Dica Rápida</option>
              </select>

              <label style={{ fontWeight: 'bold', marginTop: '10px' }}>Foto do Prato/Dica:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setArquivo(e.target.files[0])} 
                style={styles.input}
                required
              />

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
  label: { fontWeight: 'bold', color: '#34495e' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' },
  textarea: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', height: '150px', resize: 'vertical' },
  submitButton: { backgroundColor: '#27ae60', color: 'white', padding: '15px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }
};

export default App;
