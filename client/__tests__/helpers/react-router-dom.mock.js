//Creates react-router-dom mock so tests can use the linking reference provided by it

const React = require('react');

const ReactRouterDOM = {
  Link: ({ to, children }) => React.createElement('a', { href: to }, children)
};

module.exports = ReactRouterDOM;




