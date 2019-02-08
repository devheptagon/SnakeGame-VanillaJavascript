var Config = function (_preConfig) {
    var self = _preConfig || {};

    self.Directions = {
        Left: 37, Up: 38, Right: 39, Down: 40
    },
    
    self.Locals = {
        BoxesPerRow : 8,
        BoxSize : 30,
        ElapsedTime : 0,
        Timer : null,
        CurrentDirection : self.Directions.Right,
        SnakeCells : [],
        EmptyCells : [],
        AllCells : [],
        InvalidLefts : [],
        InvalidRights : [],
        FruitCell : null,
        IsGameOver : false,
        EnlargeSnake: false,
        Interval : 300,
    },
    
    self.Messages = {
        InvalidBoxCountWarning: "Please check configuration, box count must >= 8",
        GameOverWarning: "Game Over",
        WinText: "You win!",
    },
    
    self.Elements = {
        ContainerDivId: "#divContainer",
        ScoreSpanId: "#spnScore",
        TimeSpanId: "#spnTime",
        ClearSpanHTML: "<span class='clear'></span>",
        BoxDivHTML: "<div id='{0}'></div>",
        FruitCssClassName: "fruit",
        HeadCssClassName: "head",
        SnakeCellCssClassName: "snakeCell"
    }

    return self;
}
