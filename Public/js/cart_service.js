function addtocart(product){
    const memory =JSON.parse(localStorage.getItem("NLYZ"));
    //console.log(memory)
   // let Count = 0;
    if(!memory){
        const newProduct = GetNewProductForMemory(product);
        localStorage.setItem("NLYZ",JSON.stringify([newProduct]));
       // Count = 1;
    }else{
        const index_product = memory.findIndex(product_x => product_x.Id_producto === product.Id_producto);
        //console.log(index_product);
        const newmemory = memory;
        if(index_product === -1){
            newmemory.push(GetNewProductForMemory(product));
            //Count = 1;
        }else{
            newmemory[index_product].quantity ++;
            //Count = newmemory[index_product].quantity;
        }
        localStorage.setItem("NLYZ",JSON.stringify(newmemory));
    }
    UpdateNumberCart();
    //return Count;
}

function reducetocart(product){
    const memory =JSON.parse(localStorage.getItem("NLYZ"));
    const index_product = memory.findIndex(product_x => product_x.Id_producto === product.Id_producto);
    if(memory[index_product].quantity === 1){
        memory.splice(index_product,1);
    }else{
        memory[index_product].quantity--;
    }
    localStorage.setItem("NLYZ", JSON.stringify(memory));
    UpdateNumberCart();
}

/*-- Toma un producto, le agrega una cantidad y lo devuelve --*/
function GetNewProductForMemory(product){
    const newProduct = product;
    newProduct.quantity = 1;
    return newProduct;
}

const CountCartElement = document.getElementById('Cart_counter');

function UpdateNumberCart(){
    const memory =JSON.parse(localStorage.getItem("NLYZ"));
    if(memory && memory.length > 0){
        const count = memory.reduce((acum, current) => acum + current.quantity,0);
        CountCartElement.innerText = count;
    }else{
        CountCartElement.innerText = 0;
    }
}

UpdateNumberCart();