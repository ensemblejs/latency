'use strict';

var first = require('lodash').first;
var PIXI = require('pixi.js');

//jshint maxparams:false
module.exports = {
  type: 'OnClientReady',
  deps: ['Config', 'StateTracker', 'DefinePlugin', 'CurrentState', 'CurrentServerState', '$'],
  func: function View (config, tracker, define, currentState, currentServerState, $) {

    function updateBall (current, prior, ball) {
      ball.position.x = current.x;
      ball.position.y = current.y;
    }

    function cursorPosition (state) {
      return state.demo.position;
    }

    function createServerBall () {
      var ball = new PIXI.Graphics();
      ball.beginFill(0xff0000);
      ball.drawCircle(0, 0, 5);

      return ball;
    }

    function createClientBall () {
      var ball = new PIXI.Graphics();
      ball.beginFill(0x0000ff);
      ball.drawCircle(0, 0, 5);

      return ball;
    }

    function createDirectBall () {
      var ball = new PIXI.Graphics();
      ball.beginFill(0x00ff00);
      ball.drawCircle(0, 0, 5);

      return ball;
    }

    return function setup (dims) {
      var stage = new PIXI.Container();
      var renderer = PIXI.autoDetectRenderer(dims.usableWidth, dims.usableHeight);
      $()('#' + config().client.element).append(renderer.view);

      var serverBall = createServerBall();
      var clientBall = createClientBall();
      var directBall = createDirectBall();
      stage.addChild(serverBall);
      stage.addChild(clientBall);
      stage.addChild(directBall);

      tracker().onChangeOf('demo.position', updateBall, clientBall);

      $()('#input').on('touchstart touchmove', function (e) {
        var touch = first(e.touches);

        directBall.position = {
          x: touch.clientX - touch.target.offsetLeft,
          y: touch.clientY - touch.target.offsetTop
        };
      });

      define()('OnRenderFrame', function OnRenderFrame () {
        return function updateServerBall () {
          var position = currentServerState().get(cursorPosition);

          serverBall.position = position;
          serverBall.tint = 0xff0000;
        };
      });

      define()('OnRenderFrame', function OnRenderFrame () {
        return function renderScene () {
          renderer.render(stage);
        };
      });
    };
  }
};