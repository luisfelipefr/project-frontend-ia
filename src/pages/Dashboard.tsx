import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Trash } from 'lucide-react'
import { Modal } from '../components/Modal'

type Product = { id: number; name: string; price: number; description?: string; quantity?: number }

export default function Dashboard() {
  const { user, logout } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data))
  }, [])

  function handleProductCreated(product: Product) {
    setProducts((prevProducts) => [...prevProducts, product])
  }

  async function deleteProduct(id: number) {
    try {
      await api.delete(`/products/${id}`)
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Saamauditoria</h1>
          <div className="flex items-center gap-6">
            <span className="text-base text-slate-600">Olá, <b>{user?.username}</b></span>
            <button onClick={logout} className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-600 transition delay-150 duration-300 ease-in-out">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-10">
          <h2 className="text-2xl font-medium self-center">Produtos</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-indigo-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
          >
            Adicionar Produto
          </button>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {products.map(p => (
            <li key={p.id} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="flex justify-between">
                <h3 className="font-semibold self-center break-all">{p.name}</h3>
                <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-900 transition delay-150 duration-300 ease-in-out ml-3">
                  <Trash />
                </button>
              </div>
              <p className="text-sm text-slate-800 mb-2 mt-3 break-all">{p.description || 'Sem descricao'}</p>
              <p className="font-medium mb-1">R$ {p.price}</p>
              <p className="text-sm text-slate-600">Quantidade: {p.quantity ?? 0}</p>
            </li>
          ))}
        </ul>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
    </div>
  )
}
