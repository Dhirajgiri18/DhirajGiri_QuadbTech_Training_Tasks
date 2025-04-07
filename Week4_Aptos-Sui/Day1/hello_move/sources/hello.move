module hello_move::Hello {
    use aptos_std::debug;
    
    public entry fun say_hello(account: &signer) {
        aptos_std::debug::print(&b"Hello from Aptos Move!");
    }
}
