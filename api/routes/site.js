/*
 * GET home page.
 */

function index(req, res) {
    res.render('index');
}

module.exports = {
    index: index
};