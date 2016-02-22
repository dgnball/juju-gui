/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

YUI.add('user-profile-list', function() {

  juju.components.UserProfileList = React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired,
      data: React.PropTypes.array.isRequired,
      uuidKey: React.PropTypes.string.isRequired,
      clickHandler: React.PropTypes.func,
      whitelist: React.PropTypes.array
    },

    /**
      Generates the divs for each key in the row item.

      @method _generateRowItems
      @param {Object} item The object which contains the data to display.
      @param {Boolean} showKeys If you want to show the keys instead of the
        data. This is used to generate the header row.
    */
    _generateRowItems: function(item, showKeys) {
      var items = [];
      Object.keys(item).forEach((key) => {
        if (this.props.whitelist) {
          var valid = this.props.whitelist.some(whiteKey => key === whiteKey);
          if (!valid) { return; }
        }
        var value = showKeys ? key : item[key];
        // If the value is a function, we actually want the function's return
        // value. That allows us to wrap complex data types in functions that
        // return their JSX value.  For example, a function that iterates
        // through an array of URLs, returning anchor elements for each.
        if (typeof value === 'function') {
          value = value();
        }
        var reactKey = `${item[this.props.uuidKey]}-${key}`;
        items.push(
          <div
            className="user-profile-list__line-item"
            data-key={key}
            key={reactKey}>
            {value}
          </div>);
      });
      return items;
    },

    /**
      Generate the rows from the passed in data.

      @method _generateRows
    */
    _generateRows: function() {
      var rows = [];
      rows.push(this._generateHeaders());
      this.props.data.forEach((item) => {
        var rowItems = this._generateRowItems(item);
        var key = item[this.props.uuidKey];
        rows.push(
          <li
            className="user-profile-list__item-row"
            key={key}
            data-uuid={key}
            onClick={this._clickHandler}>
            {rowItems}
          </li>);
      });
      return rows;
    },

    /**
      Generates the header list item.

      @method _generateHeaders
    */
    _generateHeaders: function() {
      var header = this._generateRowItems(this.props.data[0], true);
      var key = `${this.props.title}-header-row`;
      return (
        <li
          className="user-profile-list__header-row"
          key={key}>
          {header}
        </li>);
    },

    /**
      Returns the approrpriate body content depending on the existence of
      data. This will display a spinner if there is no data provided. Simply
      re-render the component with data and it will update its UI to the list
      instead.

      @method displayData
    */
    displayData: function() {
      if (!this.props.data) {
        return <juju.components.Spinner />;
      }
      if (this.props.data.length === 0) {
        // XXX kadams54: Need to think about a way to make this message more
        // user-friendly and data-specific, i.e., "No charms found".
        return 'No data found.';
      }
      // If we have data then dynamically generate the columns and rows
      return (
        <ul>
          {this._generateRows()}
        </ul>);
    },

    /**
      Calls to handle user clicks on a profile list item.

      @method _clickHandler
      @param {Object} e The click event.
    */
    _clickHandler: function(e) {
      var target = e.currentTarget;
      var handler = this.props.clickHandler;
      if (handler) {
        handler(
          target.getAttribute('data-uuid'),
          target.querySelector('[data-key=name]').innerText);
      }
    },

    render: function () {
      var length = (this.props.data && this.props.data.length) || 0;
      return (
        <div className="user-profile-list twelve-col">
          <div className="user-profile-list__header">
            {this.props.title}
            <span className="user-profile-list__size">
              {' '} ({length})
            </span>
          </div>
          {this.displayData()}
        </div>);
    }

  });

}, '', {
  requires: [
    'loading-spinner'
  ]
});
