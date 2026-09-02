import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Create Product</h1>
        <p className="text-sm text-muted">Add a new product to your catalog</p>
      </div>
      <ProductForm />
    </div>
  );
}
