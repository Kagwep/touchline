use core::poseidon::poseidon_hash_span;
use core::poseidon::PoseidonTrait;
use core::hash::HashStateTrait;

use core::integer::u256;


#[derive(Serde, Copy, Drop, PartialEq, Debug)]
enum Position {
    Goalkeeper,
    Defender,
    Midfielder,
    Forward
}

#[derive(Serde, Copy, Drop, PartialEq, Debug)]
enum Rarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary
}

// Convert Position enum to felt252
fn position_to_felt(position: Position) -> felt252 {
    match position {
        Position::Goalkeeper => 0,
        Position::Defender => 1,
        Position::Midfielder => 2,
        Position::Forward => 3,
    }
}

// Convert Rarity enum to felt252
fn rarity_to_felt(rarity: Rarity) -> felt252 {
    match rarity {
        Rarity::Common => 0,
        Rarity::Uncommon => 1,
        Rarity::Rare => 2,
        Rarity::Epic => 3,
        Rarity::Legendary => 4,
    }
}

#[derive(Drop)]
struct Card {
    id: u128,
    player_name: felt252,
    team: felt252,
    position: Position,
    attack: u8,
    defense: u8,
    special: u8,
    rarity: Rarity,
    season: felt252,
}



fn compute_hash_on_card(card: Card, secret_key: felt252) -> u256 {
    // Create an array with all elements
    let mut elements = ArrayTrait::new();
    elements.append(secret_key);
    elements.append(card.id.into());
    elements.append(card.player_name);
    elements.append(card.team);
    elements.append(position_to_felt(card.position));
    elements.append(card.attack.into());
    elements.append(card.defense.into());
    elements.append(card.special.into());
    elements.append(rarity_to_felt(card.rarity));
    elements.append(card.season);


    
    // Use poseidon hash span to compute the hash
    poseidon_hash_span(elements.span()).into()
}



fn hash_card_sequential(card: Card, secret_key: felt252) -> felt252 {
    // Start hashing with the secret key
    let mut state = PoseidonTrait::new();
    state = state.update(secret_key);
    state = state.update(card.id.into());
    state = state.update(card.player_name);
    state = state.update(card.team);
    state = state.update(position_to_felt(card.position));
    state = state.update(card.attack.into());
    state = state.update(card.defense.into());
    state = state.update(card.special.into());
    state = state.update(rarity_to_felt(card.rarity));
    state = state.update(card.season);

    // Finalize and return the hash
    state.finalize()
}

fn main() -> u32 {
    


      fib(16)
}

fn fib(mut n: u32) -> u32 {
    let mut a: u32 = 0;
    let mut b: u32 = 1;
    while n != 0 {
        n = n - 1;
        let temp = b;
        b = a + b;
        a = temp;
    };
    a
}




#[cfg(test)]
mod tests {
    use super::fib;
    use super::{compute_hash_on_card,hash_card_sequential};
    use super::{Card,Position,Rarity};
    

    #[test]
    fn it_works() {
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
    
          println!("{}",hash_card_sequential(sample,'0xb79f5af6b'));

          let low_felt: u128 = 175786093962502268072821494840241737693;
          let high_felt: u128 = 3826217269994083699543266288383934437;

          
          let my_u256 = u256 { low: low_felt, high: high_felt };

          println!("{my_u256}");
    
        assert(fib(16) == 987, 'it works!');
    }
}
