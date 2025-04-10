address 0x61f8783cbbac0b4e00c728fd2eac8fad7da48adfdb71dca6020efd9f5fa39a86 {
    module GasTracker {

        use 0x1::Signer;
        use 0x1::Vector;
        use 0x1::collections::Map;

        struct TransactionInfo has store {
            gas_used: u64,
            gas_refunded: u64,
            status: bool, // true for success, false for failure
        }

        // Define a map to store the transaction info by transaction hash
        // The map key is a transaction hash (a vector of bytes), and the value is the transaction info
        struct TxMap has store {
            data: map<vector<u8>, TransactionInfo>,
        }

        // Function to log a transaction's details
        public fun log_transaction(
            tx_hash: vector<u8>, 
            gas_used: u64, 
            gas_refunded: u64, 
            status: bool, 
            tx_map: &mut TxMap
        ) {
            let tx_info = TransactionInfo {
                gas_used,
                gas_refunded,
                status,
            };

            // Insert the transaction info into the map
            Map::insert(&mut tx_map.data, tx_hash, tx_info);
        }

        // Function to get transaction info by hash
        public fun get_transaction_info(
            tx_hash: vector<u8>, 
            tx_map: &TxMap
        ): Option<TransactionInfo> {
            Map::get(&tx_map.data, tx_hash)
        }

    }
}
