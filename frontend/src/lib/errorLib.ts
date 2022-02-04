const onError = (error: any) => {
    let message = error.toString();
    if (!(error instanceof Error) && error.message) {
        message = error.message
    }
    alert(message);
}
export default onError