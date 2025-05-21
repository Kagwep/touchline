use starknet::ContractAddress;

#[starknet::interface]
trait ICardNFT<TContractState> {
    fn mint(ref self: TContractState, recipient: ContractAddress,token_id_low: felt252,token_id_high: felt252) -> u256;
}

#[starknet::contract]
mod CardNFT {
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::ContractAddress;
    use super::ICardNFT;
        use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map,
    };


    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // ERC721 Mixin
    #[abi(embed_v0)]
    impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        next_token_id: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        let name = "CardNFT";
        let symbol = "TFC";
        let base_uri = "https://touchline-metadata.s3.amazonaws.com/metadata/";
        self.erc721.initializer(name, symbol, base_uri);
    }

    #[abi(embed_v0)]
    impl CardNFTImpl of ICardNFT<ContractState> {

        fn mint(ref self: ContractState, recipient: ContractAddress, token_id_low: felt252,token_id_high: felt252) -> u256 {
            let token_id: u256 = u256 { low: token_id_low.try_into().unwrap(), high: token_id_high.try_into().unwrap() };
            self.erc721.mint(recipient, token_id);
            token_id
        }
         
    }

}