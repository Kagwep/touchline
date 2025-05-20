#[cfg(test)]
mod tests {
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef,
    };

    use touchline::systems::actions::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use touchline::models::card{Card, m_Card, PositionToCard, m_PositionToCard,SpecialAbility, m_SpecialAbility,, Rarity,Position};

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "touchline",
            resources: [
                TestResource::Model(m_Card::TEST_CLASS_HASH),
                TestResource::Model(m_PositionToCard::TEST_CLASS_HASH),
                TestResource::Model(m_SpecialAbility::TEST_CLASS_HASH),
                TestResource::Contract(actions::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"touchline", @"actions")
                .with_writer_of([dojo::utils::bytearray_hash(@"touchline")].span())
        ]
            .span()
    }

    #[test]
    fn test_world_test_set() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        let sample = Card {
            id: 123456789,
            player_name: 'Lionel Messi',
            team: 'Inter Miami',
            position: Position::Forward,
            attack: 94,
            defense: 35,
            special: 98,
            rarity: Rarity::Legendary,
            season: '2025',
          };


        world.write_model_test(@sample);

        let mut card: Card = world.read_model(sample.id);
        assert(card.season == '2025', 'write failed');


    }

    #[test]
    #[available_gas(30000000)]
    fn test_commit() {
        let caller = starknet::contract_address_const::<0x0>();

        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());
        world.sync_perms_and_inits(contract_defs());

        let (contract_address, _) = world.dns(@"actions").unwrap();
        let actions_system = IActionsDispatcher { contract_address };

        actions_system.spawn();
        let initial_moves: Moves = world.read_model(caller);
        let initial_position: Position = world.read_model(caller);

        assert(
            initial_position.vec.x == 10 && initial_position.vec.y == 10, 'wrong initial position',
        );

        actions_system.move(Direction::Right(()).into());

        let moves: Moves = world.read_model(caller);
        let right_dir_felt: felt252 = Direction::Right(()).into();

        assert(moves.remaining == initial_moves.remaining - 1, 'moves is wrong');
        assert(moves.last_direction.unwrap().into() == right_dir_felt, 'last direction is wrong');

        let new_position: Position = world.read_model(caller);
        assert(new_position.vec.x == initial_position.vec.x + 1, 'position x is wrong');
        assert(new_position.vec.y == initial_position.vec.y, 'position y is wrong');
    }
}
