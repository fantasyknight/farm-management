import React, { ChangeEvent, FC, KeyboardEvent } from 'react';
import Input from '../input/Input';
import SearchIcon from '../SearchIcon';

import './styles.scss';

interface IOwnProps {
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    data?: string,
  ) => void;
  value: string;
  onSearch: () => void;
}

const Search: FC<IOwnProps> = ({ onChange, value, onSearch }) => {
  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className='search' onKeyDown={handleOnKeyDown}>
      <Input
        type='text'
        onChange={onChange}
        value={value}
        label=''
        placeholder='Search...'
      />
      <span
        className='search__icon'
        onClick={() => onSearch()}
        onKeyDown={() => onSearch()}
        role='button'
        tabIndex={0}
      >
        <SearchIcon />
      </span>
    </div>
  );
};

export default Search;
