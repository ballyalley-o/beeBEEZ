exports.notFound = (req, res, next) => {
    res
      .status(404)
      .render("not-found", {
        pageTitle: "Page Not Found",
        path: "/not-found",
        isAuthenticated: req.session.isLoggedIn,
      });
}