import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

type users = { id: number; username: string; email?: string }
type products = { id: number; name: string; price: number; description?: string; quantity?: number }

export default function Dashboard() {
  const [users, setUsers] = useState<users[]>([])
  const { user, logout } = useAuth()

  const [products, setProducts] = useState<products[]>([])

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data))
    api.get('/products').then(r => setProducts(r.data))
  }, [])

  async function addProduct() {
    try {
      const { data } = await api.post("/products", {
        name: "Produto teste",
        price: 99.90,
        description: "Descrição do produto teste",
        quantity: 10
      });
      setProducts([...products, data]); // adiciona o novo produto no estado
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteProduct(id: number) {
    try {
      await api.delete(`/products/${id}`);
      setProducts((products) => products.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Cadastro</h1>
          <div className="flex items-center gap-3">
            <span className="text-base text-slate-600">Olá, <b>{user?.username}</b></span>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-lg font-medium mb-4">Produtos</h2>
        <button onClick={addProduct} 
        className="mb-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Adicionar Produto
        </button>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <li key={p.name} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className='flex justify-between '>
                <h3 className="font-semibold">{p.name}</h3>
                <div className='border-2 rounded-lg border-red-300 p-2 '>
                  <button onClick={() => deleteProduct(p.id)} className='text-red-600'>deletar</button>
                </div>
              </div>

              <p className="text-sm text-slate-800 mb-2">{p.description}</p>
              <p className="font-medium">R$ {p.price}</p>
              <p className="text-sm text-slate-600">Qtd: {p.quantity}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
