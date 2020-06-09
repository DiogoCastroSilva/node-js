const deleteProduct = (btn) => {
    const id = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');

    fetch(`/admin//product/${id}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        console.log(data);
        productElement.remove();
        // productElement.parentNode.removeChild(productElement);
    })
    .catch(e => {
        console.log(e);
    });
};