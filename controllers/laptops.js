const getAllLaptops = async (req, res) => {
    res.send('Get all laptops')
}

const getLaptop = async (req, res) => {
    res.send('Get laptop')
}

const createLaptop = async (req, res) => {
    res.json(req.user)
}

const updateLaptop = async (req, res) => {
    res.send('Update laptop')
}

const deleteLaptop = async (req, res) => {
    res.send('Delete laptop')
}

module.exports = {
    getAllLaptops,
    getLaptop,
    createLaptop,
    updateLaptop,
    deleteLaptop,
}