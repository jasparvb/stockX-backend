const sqlForPartialUpdate = require("../../helpers/partialUpdate");


describe("partialUpdate()", () => {
  it("should generate proper partial update query with 1 field", function () {
    const {query, values} = sqlForPartialUpdate(
        "users",
        {email: "messi10@fcb.es"},
        "username",
        "testuser"
    );

    expect(query).toEqual(
        "UPDATE users SET email=$1 WHERE username=$2 RETURNING *"
    );

    expect(values).toEqual(["messi10@fcb.es", "testuser"]);
  });
});
