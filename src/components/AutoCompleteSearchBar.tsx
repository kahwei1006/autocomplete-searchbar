import axios from "axios";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ProductLists from "./ProductLists";
import LoadingSpinner from "./LoadingSpinner"; 

type Product = {
    id: number;
    title: string;
    image: string;
};

export default function AutoCompleteSearchBar() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]); 
    const [selectedProductIndex, setSelectedProductIndex] = useState<number>(-1); 
    const [loading, setLoading] = useState(false); 
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get("https://fakestoreapi.com/products");
            setProducts(data);
        };
        fetchData();
    }, []);

    function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setQuery(value);
        setLoading(true); 

        setTimeout(() => {
            const filteredResults = products.filter((product) =>
                product.title.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filteredResults);
            setSelectedProductIndex(-1); 
            setLoading(false);
        }, 500); 
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "ArrowUp") {
            
            setSelectedProductIndex((prevIndex) =>
                prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1
            );
        } else if (event.key === "ArrowDown") {
            
            setSelectedProductIndex((prevIndex) =>
                prevIndex === searchResults.length - 1 ? 0 : prevIndex + 1
            );
        } else if (event.key === "Enter") {
           
            if (selectedProductIndex !== -1) {
                const selectedProduct = searchResults[selectedProductIndex];
                handleProductClick(selectedProduct.id);
            }
        } else if (event.key === "Escape") {
            
            setQuery("");
            setSearchResults([]);
            setSelectedProductIndex(-1);
        }
    }

    function handleProductClick(productId: number) {
        setSelectedProductIds((prevSelected) => {
            if (prevSelected.includes(productId)) {
                
                return prevSelected.filter((id) => id !== productId);
            } else {
              
                return [...prevSelected, productId];
            }
        });
    }

    
    function handleRemoveProduct(productId: number) {
        setSelectedProductIds((prevSelected) =>
            prevSelected.filter((id) => id !== productId)
        );
    }

    return (
        <div className="font-FiraCode flex flex-col max-w-lg mx-auto mt-20">
            <input
                type="text"
                className="px-4 py-1 border-gray-500 shadow-sm focus:outline-none 
            focus:ring-2 focus:border-blue-500"
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                value={query}
                ref={inputRef}
                placeholder="Search Products"
            />
            {loading ? (
                <LoadingSpinner /> 
            ) : query !== "" && searchResults.length === 0 ? (
                <p className="text-gray-500 text-center mt-4">No results found</p> 
            ) : (
                query !== "" &&
                searchResults.length > 0 && (
                    <ProductLists
                        products={searchResults}
                        selectedProductIds={selectedProductIds}
                        selectedProductIndex={selectedProductIndex}
                        handleProductClick={handleProductClick}
                    />
                )
            )}

            
            {selectedProductIds.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold bg-gray-100">Selected Products:</h3>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Product ID</th>
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProductIds.map((id) => {
                                const selectedProduct = products.find(
                                    (product) => product.id === id
                                );
                                return (
                                    <tr key={id } className="bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">
                                            {selectedProduct?.id}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {selectedProduct?.title}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() =>
                                                    handleRemoveProduct(selectedProduct?.id || 0)
                                                }
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
