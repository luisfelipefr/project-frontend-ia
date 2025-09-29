import { FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import api from "../services/api";

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
};

const DESCRIPTION_LIMIT = 100;
const NAME_LIMIT = 50;

function limitCharacters(value: string, limit: number) {
  if (value.length <= limit) {
    return value;
  }
  return value.slice(0, limit);
}


export function Modal({ isOpen, onClose, onProductCreated }: ModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const descriptionCharacters = useMemo(() => description.length, [description]);
  const nameCharacter = useMemo(() => name.length, [name])

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function resetForm() {
    setName("");
    setPrice("");
    setDescription("");
    setQuantity("");
    setErrorMessage(null);
  }

  function handleClose() {
    if (loading) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const priceValue = parseFloat(price.replace(",", "."));
    const quantityValue = quantity ? parseInt(quantity, 10) : undefined;
    const safeDescription = description.trim() || undefined;
    const safeName = name.trim();

    if (!name.trim() || Number.isNaN(priceValue)) {
      
      setErrorMessage( !name.trim ? "Informe um nome valido." : "Informe um valor valido");
      
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post<Product>("/products", {
        name: safeName,
        price: priceValue,
        description: safeDescription,
        quantity: quantityValue,
      });

      onProductCreated(data);
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      setErrorMessage("Nao foi possivel criar o produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-800"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold text-slate-900">Novo Produto</h3>
        <p className="mt-1 text-sm text-slate-600">
          Preencha as informacoes para cadastrar um novo produto no catalogo.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="product-name">
              Nome
            </label>
            <input
              id="product-name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Digite o nome"
              value={name}
              onChange={(event) => setName(limitCharacters(event.target.value, NAME_LIMIT ))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="product-price">
              Preco
            </label>
            <input
              id="product-price"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="0,00"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="product-quantity">
              Quantidade
            </label>
            <input
              id="product-quantity"
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="0"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="product-description">
              Descricao (max {DESCRIPTION_LIMIT} caracteres)
            </label>
            <textarea
              id="product-description"
              className="h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Conte um pouco sobre o produto"
              value={description}
              onChange={(event) => setDescription(limitCharacters(event.target.value, DESCRIPTION_LIMIT))}
            />
            <p className="mt-1 text-xs text-slate-500">
              {descriptionCharacters}/{DESCRIPTION_LIMIT} caracteres usados
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
