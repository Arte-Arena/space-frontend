const useLatestOrcamento = async() => {
      
    const emailVendedor =
        typeof window !== "undefined" ? localStorage.getItem("email") : null;
    
    const nomeVendedor = 
        typeof window !== "undefined" ? localStorage.getItem("name") : null;

    return {emailVendedor, nomeVendedor}

}

export default useLatestOrcamento;
