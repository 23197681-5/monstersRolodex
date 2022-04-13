import { Component } from 'react';
import { Input } from '@chakra-ui/react';
import styles from './search-box.module.css';
const SearchBox = ({ placeholder, onChangeHandler }) => {
  return (
    <p>
      <input
        className={`searchBox ${styles.searchBox}`}
        type="search"
        htmlSize={4}
        width="320px"
        placeholder={placeholder}
        onChange={onChangeHandler}
      />
    </p>
  );
};

export default SearchBox;
