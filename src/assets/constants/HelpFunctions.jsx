const validate_Price = (value, setField) => {

    value = value.trim();
    const regex = /^\d+\.?\d*$/;

    if (value.slice(0, 1) == 0 && value.slice(0, 2) != '0.') {
        value = value.slice(1)
    }

    if (regex.test(value) || value == '') {
        setField(value || 0)
    }

}
export {
    validate_Price
}