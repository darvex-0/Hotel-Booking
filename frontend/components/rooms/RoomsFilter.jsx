
import React, { useEffect, useState } from 'react';
import Title from '../home/Title';

export default function RoomFilter({ ourRooms, setOurFilteredRooms }) {
  const [selectedType, setSelectedType] = useState('all');
  const [allowBreakfast, setAllowBreakfast] = useState(false);
  const [allowPets, setAllowPets] = useState(false);

  const prices = ourRooms.map((room) => Number(room.room_price));
  const maxPrice = prices.length ? Math.max(...prices) : 1000;
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const [selectedPrice, setSelectedPrice] = useState(1000);

  // set selected price to max price when ourRooms loaded
  useEffect(() => {
    if (prices.length) {
      setSelectedPrice(maxPrice);
    }
  }, [ourRooms]);

  // unified filter effect
  useEffect(() => {
    let filtered = [...ourRooms];

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((room) => room.room_type === selectedType);
    }

    // Filter by price
    filtered = filtered.filter((room) => Number(room.room_price) <= selectedPrice);

    // Filter by breakfast
    if (allowBreakfast) {
      filtered = filtered.filter((room) => !!room.provide_breakfast);
    }

    // Filter by pets
    if (allowPets) {
      filtered = filtered.filter((room) => !!room.allow_pets);
    }

    setOurFilteredRooms(filtered);
  }, [selectedType, selectedPrice, allowBreakfast, allowPets, ourRooms]);

  return (
    <section className='filter-container'>
      <Title title='search rooms' />

      <form className='filter-form'>
        {/* select type start */}
        <div className='form-group'>
          <label htmlFor='type'>rooms type</label>
          <select
            className='form-control'
            onChange={(e) => setSelectedType(e.target.value)}
            value={selectedType}
            name='type'
            id='type'
          >
            <option value='all'>All</option>
            <option value='single'>Single</option>
            <option value='couple'>Couple</option>
            <option value='family'>Family</option>
            <option value='presidential'>Presidential</option>
          </select>
        </div>
        {/* select type end */}

        {/* room price start */}
        <div className='form-group'>
          <label htmlFor='price'>{`room price: $${selectedPrice}`}</label>
          <input
            className='form-control'
            type='range'
            name='price'
            id='price'
            min={minPrice}
            max={maxPrice}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(Number(e.target.value))}
          />
        </div>
        {/* room price end */}

        {/* extras start */}
        <div className='form-group'>
          {/* breakfast checked */}
          <div className='single-extra'>
            <input
              name='breakfast'
              type='checkbox'
              id='breakfast'
              checked={allowBreakfast}
              onChange={() => setAllowBreakfast(!allowBreakfast)}
            />
            <label htmlFor='breakfast'>breakfast</label>
          </div>

          {/* pets checked */}
          <div className='single-extra'>
            <input
              type='checkbox'
              name='pets'
              id='pets'
              checked={allowPets}
              onChange={() => setAllowPets(!allowPets)}
            />
            <label htmlFor='pets'>pets</label>
          </div>
        </div>
        {/* extras end */}
      </form>
    </section>
  );
}
