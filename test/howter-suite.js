describe('Howter can', function () {

  var callback;

  beforeEach(function () {
    callback = {
      dummy: function (context) {
        console.log(context.path);
      }
    };

    spyOn(callback, 'dummy');

    Howter.route('/welcome', callback.dummy);
    Howter.route('/contact', callback.dummy).route('/error', callback.dummy);
    Howter.route(['/users/list', '/products/list'], callback.dummy);
  });

  it('call a route when path matches exactly', function () {
    Howter.dispatch('/welcome');

    expect(callback.dummy).toHaveBeenCalled();
  });

  it('call a route when path contains a trailing slash', function () {
    Howter.dispatch('/welcome/');

    expect(callback.dummy).toHaveBeenCalled();
  });

  it('handle multiple routes', function () {
    Howter.dispatch('/welcome');
    Howter.dispatch('/contact');

    expect(callback.dummy.calls.count()).toEqual(2);
  });

  it('handle chained routes', function () {
    Howter.dispatch('/error');

    expect(callback.dummy).toHaveBeenCalled();
  });

  it('handle multiple paths routes', function () {
    Howter.dispatch('/users/list');
    Howter.dispatch('/products/list');

    expect(callback.dummy.calls.count()).toEqual(2);
  });

  it('handle named parameters', function () {
    pending();
  });

  it('group routes by prefix', function () {
    pending();
  });

  it('have an universal prefix', function () {
    pending();
  });

  it('handle regular expressions', function () {
    pending();
  });

  it('handle route extensions', function () {
    pending();
  });

});
