const getImage = (req:any, res:any) => {
    let path = __dirname.replace("/controller","")
    res.sendFile(`${path}/public/images/${req.params.Id}`)
}

export default getImage