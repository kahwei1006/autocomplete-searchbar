import { useEffect } from "react";

type Product = {
    id: number;
    title: string;
    image: string;
};

type ProductListsProps = {
    selectedProductIds: number[]; 
    products: Product[];
    selectedProductIndex: number; 
    handleProductClick: (productId: number) => void;
};

export default function ProductLists({
    products,
    selectedProductIds,
    selectedProductIndex,
    handleProductClick,
}: ProductListsProps) {
    useEffect(() => {
      
        const activeProduct = document.getElementById(`product-${selectedProductIndex}`);
        if (activeProduct) {
            activeProduct.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedProductIndex]);

    return (
        <div className="bg-white max-h-96 overflow-y-scroll resultProductContainer">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    id={`product-${index}`}
                    className={`py-2 px-4 flex items-center justify-between gap-8 cursor-pointer 
                    ${selectedProductIndex === index ? 'bg-gray-200' : ''}`}
                    onClick={() => handleProductClick(product.id)}
                >
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => handleProductClick(product.id)}
                        />
                        <p className="ml-2">{product.title}</p>
                    </div>
                    <img src={product.image} alt={product.title} className="w-8" />
                </div>
            ))}
        </div>
    );
}
