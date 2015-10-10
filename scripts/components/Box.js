var React = require('react');

module.exports = React.createClass({
  render: function() {
    return <div className={'plot-box type-'+this.props.plantType} onClick={this.boxClick} />;
  },

  boxClick: function() {
    this.props.boxChange(this.props.x, this.props.y);
  }
});
