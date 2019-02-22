import React from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'

const ContentHeader = ({children, ...props}) =>
  <Typography variant="h3" gutterBottom component="div" {...props}>
    {children}
  </Typography>

ContentHeader.propTypes = {
  children : PropTypes.node.isRequired
}

export {
  ContentHeader
}
