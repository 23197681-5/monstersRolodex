import { Component } from 'react';
import { Input } from '@chakra-ui/react';
import styles from './search-box.module.css';
class SearchBox extends Component {
  render() {
    return (
      <p>
        <input
          className={`searchBox ${styles.searchBox}`}
          type="search"
          htmlSize={4}
          width="320px"
          placeholder={this.props.placeholder}
          onChange={this.props.onChangeHandler}
        />
      </p>
    );
  }
}

export default SearchBox;
