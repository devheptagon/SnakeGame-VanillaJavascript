var Snake = function (Config) {
    var self = {};
    
    self.Reset = function (_boxesPerRow) {
        self.Locals = Object.assign({}, Config.Locals, { BoxesPerRow: _boxesPerRow });
    }

    //initialization
    self.Start = function (_boxesPerRow) {
        if (_boxesPerRow < 8) {
            alert(Config.Messages.InvalidBoxCountWarning);
            return;
        }

        self.Reset(_boxesPerRow);
        self.CreateScene();
        self.CreateSnake();
        self.CreateRandomFruit();
        self.SetTimer();
    };

    //creates board
    self.CreateScene = function () {
        var html = '';
        for (i = 0; i < self.Locals.BoxesPerRow; i++) {
            for (j = 0; j < self.Locals.BoxesPerRow; j++) {
                var id = (j + self.Locals.BoxesPerRow * i);
                html += Config.Elements.BoxDivHTML.replace("{0}", id);                
                self.Locals.AllCells.push(id);
            }
            //clear float at the end of the row to pass next row
            html += Config.Elements.ClearSpanHTML;
        }

        //Set invalid next cells according to direction
        //For ex. in a 5x5 scene, when direction is right, next values cannot be {5,10,15,20,25}         
        for (i = 1; i <= self.Locals.BoxesPerRow; i++) {
            self.Locals.InvalidRights.push(i * self.Locals.BoxesPerRow);
            self.Locals.InvalidLefts.push(i * self.Locals.BoxesPerRow - 1);
        }

        //if box size is 30px, container should have width and height of 
        //(BoxesPerRow * 30 + 1)px => 1px is for border
        var size = self.Locals.BoxesPerRow * self.Locals.BoxSize + 1;
        $(Config.Elements.ContainerDivId).css("width", size);
        $(Config.Elements.ContainerDivId).css("height", size);
        $(Config.Elements.ContainerDivId).html(html);
    };

    //creates initial snake with 5 cells
    self.CreateSnake = function () {
        //initially 5 cell snake
        self.Locals.SnakeCells = [4, 3, 2, 1, 0];
        //reset empty cells
        self.Locals.EmptyCells = self.Locals.AllCells.exclude(self.Locals.SnakeCells);
        self.RedrawSnake();
    };

    self.RedrawSnake = function () {
        $("." + Config.Elements.SnakeCellCssClassName).removeClass(Config.Elements.SnakeCellCssClassName);
        $("." + Config.Elements.HeadCssClassName).removeClass(Config.Elements.HeadCssClassName);

        $.each(self.Locals.SnakeCells, function (index, id) {
            if (index === 0)
                $("#" + id).addClass(Config.Elements.HeadCssClassName);
            else
                $("#" + id).addClass(Config.Elements.SnakeCellCssClassName);
        });
    };

    //slide cells
    self.MoveSnake = function () {
        if (self.IsCrash()) {
            self.Locals.IsGameOver = true;
            alert(Config.Messages.GameOverWarning);
            return;
        }

        //tail before slide
        var tail = self.Locals.SnakeCells[self.Locals.SnakeCells.length - 1];

        //slide cells to the 1 forward in the array beginning from the tail
        for (i = self.Locals.SnakeCells.length - 1; i > 0; i--)
            self.Locals.SnakeCells[i] = self.Locals.SnakeCells[i - 1];

        //move head of snake to new position
        self.Locals.SnakeCells[0] = self.FindNextCellAhead();
        //if EnlargeSnake flag is true, add lastcell to snake's tail
        if (self.Locals.EnlargeSnake) {
            self.Locals.SnakeCells.push(tail);
            self.Locals.EnlargeSnake = false;
        }

        self.Locals.EmptyCells = self.Locals.AllCells.exclude(self.Locals.SnakeCells);
        self.RedrawSnake();
    };

    self.FindNextCellAhead = function () {
        var head = self.Locals.SnakeCells[0];
        //move head of snake to new position
        if (self.Locals.CurrentDirection === Config.Directions.Right)
            head += 1;
        else if (self.Locals.CurrentDirection === Config.Directions.Left)
            head -= 1;
        else if (self.Locals.CurrentDirection === Config.Directions.Up)
            head -= self.Locals.BoxesPerRow;
        else if (self.Locals.CurrentDirection === Config.Directions.Down)
            head += self.Locals.BoxesPerRow;

        return head;
    };

    //place fruit in a random empty place
    self.CreateRandomFruit = function () {
        self.Locals.EmptyCells = self.Locals.AllCells.exclude(self.Locals.SnakeCells);

        var min = 0;
        var max = self.Locals.EmptyCells.length;
        //choose a random element index between min and max
        var randomIndex = Math.floor((Math.random() * max) + min);
        self.Locals.FruitCell = self.Locals.EmptyCells[randomIndex];
        self.Locals.EmptyCells.remove(self.Locals.FruitCell);

        //remove old fruit from scene
        $("." + Config.Elements.FruitCssClassName).removeClass(Config.Elements.FruitCssClassName);
        //add new fruit to scene
        $("#" + self.Locals.FruitCell).addClass(Config.Elements.FruitCssClassName);
    };

    //checks if snakes head capture fruit
    self.IsGameWon = function () {
        return (self.Locals.EmptyCells.length === 0);
    };

    //checks if snakes head capture fruit
    self.FruitHitTest = function () {
        //if (self.Locals.SnakeCells[0] === self.Locals.FruitCell) {
        if (self.Locals.SnakeCells.indexOf(self.Locals.FruitCell) > -1) {
            //add cell to snakes bottom
            self.Locals.EnlargeSnake = true;
            self.CreateRandomFruit();
            //increase speed
            if (self.Locals.Interval > 60)
                self.Locals.Interval -= 5;
        }
    };
    
    //checks if snakes head capture fruit
    self.IsCrash = function () {
        var next = self.FindNextCellAhead();
        var min = 0;
        var max = self.Locals.BoxesPerRow * self.Locals.BoxesPerRow - 1;

        //Up and Down crash check
        if (next < min || next > max)
            return true;

        //Left and Right crash check => Check edge values according to direction 
        if (self.Locals.CurrentDirection === Config.Directions.Right &&
            self.Locals.InvalidRights.indexOf(next) > -1)
            return true;
        else if (self.Locals.CurrentDirection === Config.Directions.Left &&
            self.Locals.InvalidLefts.indexOf(next) > -1)
            return true;

        return false;
    };

    //handles timer callback
    self.TimerTick = function () {
        //game over
        if (self.IsGameWon()) {
            self.Locals.IsGameOver = true;
            alert(Config.Messages.WinText);
            return;
        }

        self.MoveSnake();
        self.FruitHitTest();
        self.UpdateScore();
        self.SetTimer();

        self.Locals.ElapsedTime += self.Locals.Interval;
    };

    //handles keyboard arrow keys
    self.KeyDown = function (key) {
        if (self.Locals.IsGameOver)
            return;

        //only arrow keys are valid and new direction cannot be opposite of current direction
        var isValidKey = (key === Config.Directions.Down && self.Locals.CurrentDirection !== Config.Directions.Up) ||
                         (key === Config.Directions.Up && self.Locals.CurrentDirection !== Config.Directions.Down) ||
                         (key === Config.Directions.Left && self.Locals.CurrentDirection !== Config.Directions.Right) ||
                         (key === Config.Directions.Right && self.Locals.CurrentDirection !== Config.Directions.Left);

        if (isValidKey) {
            self.Locals.CurrentDirection = key;
            self.MoveSnake();
            //to prevent overlap with timer callback
            self.SetTimer();
        }
    };

    self.UpdateScore = function () {
        //in seconds
        var time = Math.floor(self.Locals.ElapsedTime / 1000);
        //do not count initial cells, 10 points for each fruit
        var score = (self.Locals.SnakeCells.length - 5) * 10; 
        $(Config.Elements.TimeSpanId).html(time); 
        $(Config.Elements.ScoreSpanId).html(score); 
    }

    self.StopTimer = function () {
        window.clearTimeout(self.Locals.Timer);
    };

    self.SetTimer = function () {
        window.clearTimeout(self.Locals.Timer);
        if (!self.Locals.IsGameOver)
            self.Locals.Timer = window.setTimeout(self.TimerTick, self.Locals.Interval);
    };

    return self;

};
