"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/addresses")
      .then((res) => res.json())
      .then((data) => setAddresses(data.data ?? data ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = await res.json();
      const newAddress = json.data ?? json;
      setAddresses((prev) => [...prev, newAddress]);
      setShowForm(false);
      e.currentTarget.reset();
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/account/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) return <p className="text-sm text-muted">Loading addresses...</p>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
          Addresses
        </h1>
        <Button variant="secondary" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Address"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-8 space-y-4 rounded-[var(--card-radius)] border border-border bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="firstName" label="First Name" required />
            <Input name="lastName" label="Last Name" required />
          </div>
          <Input name="phone" label="Phone" type="tel" />
          <Input name="address" label="Address" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="city" label="City" required />
            <Input name="postalCode" label="Postal Code" required />
          </div>
          <Input name="country" label="Country" defaultValue="GR" />
          <Button type="submit" variant="primary">Save Address</Button>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="text-sm text-muted">No saved addresses.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="rounded-[var(--card-radius)] border border-border bg-surface p-5"
            >
              <div className="flex justify-between">
                <div className="text-sm text-muted">
                  <p className="font-medium text-white">
                    {addr.firstName} {addr.lastName}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs text-lavender">Default</span>
                    )}
                  </p>
                  <p className="mt-1">{addr.address}</p>
                  <p>{addr.city}, {addr.postalCode}</p>
                  <p>{addr.country}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(addr.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
