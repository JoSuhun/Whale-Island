'use client';
import { useState } from 'react';
import { InitialProducts } from '../app/(taps)/products/page';
import ListProduct from './list-product';
import { getMoreProducts } from '../app/(taps)/products/actions';

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({
  initialProducts,
}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(1);
    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col p-5 gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button
        onClick={onLoadMoreClick}
        disabled={isLoading}
      >
        더가져오기
      </button>
    </div>
  );
}

