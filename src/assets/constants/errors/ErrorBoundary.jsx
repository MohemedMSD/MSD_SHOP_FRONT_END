import React, {Component} from 'react'

class ErrorBoundary extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hasError : false,
            error : null,
            errorInfo : null
        }
    }

    static getDerivedStateFromError(error)
    {
        return {
            hasError : true
        }
    }

    componentDidCatch(error, errorInfo)
    {

        this.setState({
            error, errorInfo
        })

        console.log('ErrorBoundary caught an error', error, errorInfo);

    }

    render () {
        
        if (this.state.hasError) {
            
            return (
                <div>Error</div>
            )

        }

        return this.props.children

    }

}

export default ErrorBoundary