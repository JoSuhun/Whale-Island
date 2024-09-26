'use client';
import { use, useEffect, useRef, useState } from 'react';
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
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(
            page + 1,
          );
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [
              ...prev,
              ...newProducts,
            ]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      },
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="flex flex-col p-5 gap-5 pb-24">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 300}vh`,
          }}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? '로딩 중' : 'Load more'}
        </span>
      ) : null}
    </div>
  );
}

