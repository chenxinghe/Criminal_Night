var Criminal_Night = Criminal_Night || {};

Criminal_Night.game = new Phaser.Game(2000, 850, Phaser.AUTO, '');

Criminal_Night.game.state.add('Boot', Criminal_Night.Boot);
Criminal_Night.game.state.add('Preload', Criminal_Night.Preload);
Criminal_Night.game.state.add('Menu', Criminal_Night.Menu);
Criminal_Night.game.state.add('About',Criminal_Night.About);
Criminal_Night.game.state.add('Help',Criminal_Night.Help);
Criminal_Night.game.state.add('Game', Criminal_Night.Game);
Criminal_Night.game.state.add('Lost', Criminal_Night.Lost);
Criminal_Night.game.state.start('Boot');