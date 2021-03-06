var characters, gameState
function startGame () {
  characters = resetCharacters()
  gameState = resetGameState()
  renderCharacters()
}

function resetCharacters () {
  return {
    'obiWanKenobi': {
      name: 'Obi-Wan Kenobi',
      health: 220,
      attack: 8,
      imageUrl: 'assets/images/obi-wan.jpg',
      enemyAttackBack: 15
    },
    'lukeSkywalker': {
      name: 'Luke Skywalker',
      health: 200,
      attack: 14,
      imageUrl: 'assets/images/luke-skywalker.jpg',
      enemyAttackBack: 5
    },
    'darthSidious': {
      name: 'Darth Sidious',
      health: 250,
      attack: 8,
      imageUrl: 'assets/images/darth-sidious.png',
      enemyAttackBack: 20
    },
    'darthMaul': {
      name: 'Darth Maul',
      health: 280,
      attack: 7,
      imageUrl: 'assets/images/darth-maul.jpg',
      enemyAttackBack: 25
    }
  }
}

function resetGameState () {
  return {
    selectedCharacter: null,
    selectedDefender: null,
    enemiesLeft: 0,
    numAttacks: 0
  }
}

function createCharDiv (character, key) {
  var charDiv = $("<div class='character' data-name='" + key + "'>")
  var charName = $("<div class='character-name'>").text(character.name)
  var charImage = $("<img alt='image' class='character-image'>").attr('src', character.imageUrl)
  var charHealth = $("<div class='character-health'>").text(character.health)
  charDiv.append(charName).append(charImage).append(charHealth)
  return charDiv
}

function renderCharacters () {
  console.log('rendering characters')
  var keys = Object.keys(characters)
  for (var i = 0; i < keys.length; i++) {
    var characterKey = keys[i]
    var character = characters[characterKey]
    var charDiv = createCharDiv(character, characterKey)
    $('#character-area').append(charDiv)
  }
}

function renderOpponents (selectedCharacterKey) {
  var characterKeys = Object.keys(characters)
  for (var i = 0; i < characterKeys.length; i++) {
    if (characterKeys[i] !== selectedCharacterKey) {
      var enemyKey = characterKeys[i]
      var enemy = characters[enemyKey]

      var enemyDiv = createCharDiv(enemy, enemyKey)
      $(enemyDiv).addClass('enemy')
      $('#available-to-attack-section').append(enemyDiv)
    }
  }
}

function enableEnemySelection () {
  $('.enemy').on('click.enemySelect', function () {
    console.log('opponent selected')
    var opponentKey = $(this).attr('data-name')
    gameState.selectedDefender = characters[opponentKey]

    $('#defender').append(this)
    $('#attack-button').show()
    $('.enemy').off('click.enemySelect')
  })
}

function attack (numAttacks) {
  console.log('attacking defender')
  gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numAttacks
}

function defend () {
  console.log('defender countering')
  gameState.selectedCharacter.health -= gameState.selectedDefender.enemyAttackBack
}

function isCharacterDead (character) {
  console.log('checking if player is dead')
  return character.health <= 0
}

function isGameWon () {
  console.log('checking if you won the game')
  return gameState.enemiesLeft === 0
}

function isAttackPhaseComplete () {
  if (isCharacterDead(gameState.selectedCharacter)) {
    alert('You were defeated by ' + gameState.selectedDefender.name + '. Click reset to play again.')
    $('#selected-character').empty()
    $('#reset-button').show()

    return true
  } else if (isCharacterDead(gameState.selectedDefender)) {
    console.log('defender dead')

    gameState.enemiesLeft--
    $('#defender').empty()

    if (isGameWon()) {
      alert('You win! Click Reset to play again')
      $('#reset-button').show()
    } else {
      alert('You defeated ' + gameState.selectedDefender.name + '! Select another enemy to fight.')
      enableEnemySelection()
    }
    return true
  }
  return false
}

function emptyDivs () {
  $('#selected-character').empty()
  $('#defender').empty()
  $('#available-to-attack-section .enemy').empty()
  $('#character-area').empty()
  $('#characters-section').show()
}

$(document).ready(function () {
  $('#character-area').on('click', '.character', function () {

    var selectedKey = $(this).attr('data-name')
    gameState.selectedCharacter = characters[selectedKey]
    console.log('player selected')
    $('#selected-character').append(this)
    renderOpponents(selectedKey)
    $('#characters-section').hide()
    gameState.enemiesLeft = Object.keys(characters).length - 1
    enableEnemySelection()
  })

  $('#attack-button').on('click.attack', function () {
    console.log('attack clicked')
    gameState.numAttacks++
    attack(gameState.numAttacks)
    defend()
    $('#selected-character .character-health').text(gameState.selectedCharacter.health)
    $('#defender .character-health').text(gameState.selectedDefender.health)
    if (isAttackPhaseComplete()) {
      $(this).hide()
    }
  })

  $('#reset-button').on('click.reset', function () {
    console.log('resetting game')
    emptyDivs()
    $(this).hide()
    startGame()
  })
  startGame()
})
