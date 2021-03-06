/**
 * Created by asakawa on 7/26/16.
 */
var app = angular.module('FishFate');
app.controller('diceController', function ($scope, $http, $ionicLoading, fishStream) {

  /* boolean used to stop rapid button presses */
  var isActivated = false;

  /* this arrays holds jQuery id's */
  var diceArray = [$('#die0'), $('#die1'), $('#die2'), $('#die3'), $('#die4')];
  var diceResults = [$('#dieResult0'), $('#dieResult1'), $('#dieResult2'), $('#dieResult3'), $('#dieResult4')];

  $scope.diceRoll = {
    numberDice: '5',
    numberSides: '6',
    diceValues: [1, 2, 3, 4, 5]
  };

  /**
   *  coin submit pressed:
   *    1. hide dice values
   *    2. change to new values
   *    3. animate the coins
   *  */
  $scope.submitRollDice = function () {
    var callbackOnce = true;
    if(!isActivated){
      $('.dieResult').fadeOut(100, function(){
        if (callbackOnce){
          callbackOnce = false;
          for(var i = 0; i < $scope.diceRoll.diceValues.length; i++)
            $scope.diceRoll.diceValues[i] = fishStream.getInt($scope.diceRoll.numberSides) + 1;
          rotateDice();
        }
      });
    }
  };

  /* dynamically display the selected number of coins */
  $scope.displayDice = function () {
    displayNumberDice();
  };

  /**
   * This function is called when use user interacts with the number of dice
   * slider. It's used to display/hide the dice dynamically, which uses
   * jQuery's fadeIn/fadeOut
   * */
  function displayNumberDice() {
    /* switch through the four possible states */
    switch ($scope.diceRoll.numberDice) {
      case '1':
        diceArray[1].fadeOut('fast');
        diceArray[2].fadeOut('fast');
        diceArray[3].fadeOut('fast');
        diceArray[4].fadeOut('fast');
        break;
      case '2':
        diceArray[1].fadeIn('fast');
        diceArray[2].fadeOut('fast');
        diceArray[3].fadeOut('fast');
        diceArray[4].fadeOut('fast');
        break;
      case '3':
        diceArray[1].fadeIn('fast');
        diceArray[2].fadeIn('fast');
        diceArray[3].fadeOut('fast');
        diceArray[4].fadeOut('fast');
        break;
      case '4':
        diceArray[1].fadeIn('fast');
        diceArray[2].fadeIn('fast');
        diceArray[3].fadeIn('fast');
        diceArray[4].fadeOut('fast');
        break;
      case '5':
        diceArray[1].fadeIn('fast');
        diceArray[2].fadeIn('fast');
        diceArray[3].fadeIn('fast');
        diceArray[4].fadeIn('fast');
        break;
      default:
        console.log('error, number of coins out of bounds');
        break;
    }
  }

  /**
   * animate the dice, 'spin' animation and 'toss'
   * animation run in parallel:
   *
   * spin: uses css to rotate the die 360 degrees
   * toss: simulates a dice throw
   * */
  function animateDie(element, index) {
    isActivated = true;
    element.rotate({
      angle: 0,
      animateTo: 360,
      duration: 1900
    });
    element.animate({
      top: '-100px'
    }, 500, function () {
      diceResults[index].fadeIn('fast');
      element.animate({
        top: '10px'
      }, 500, function () {
        element.animate({
          top: '-10px'
        }, 150, function () {
          element.animate({
            top: '15px'
          }, 150, function () {
            isActivated = false;
          })
        })
      })
    })
  }

  function rotateDice() {
    var diceIndex = 0;

    var diceTrigger = setInterval(function () {
      if (diceIndex == diceArray.length)
        clearInterval(diceTrigger);
      if (diceIndex < diceArray.length) {
        animateDie(diceArray[diceIndex], diceIndex);
        diceIndex++;
      }
    }, 100);
  }
});

