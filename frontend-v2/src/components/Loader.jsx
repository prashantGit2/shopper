import {Box} from "@mui/material"
const Loader = () => {
  return (
        <Box sx={{
            width:'100vw',
            height:'100vh',
            zIndex: 9999,
            display:'grid',
            placeItems: "center",
            position:'sticky',
            top:0,
            left:0,
            background: 'white',
            opacity:0.8
        }}>
            <Box sx={{
                width:"10vmax",
                height:"10vmax",
                border: "none",
                borderBottom: "5px solid #f7d136",
                borderRadius:"50%"
            }}
            className="loading"
            >

            </Box>
        </Box>
  )
}

export default Loader