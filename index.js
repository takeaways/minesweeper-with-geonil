(function(){
    const main = document.querySelector("#main");
    const main_table = document.querySelector("#main_table");
    const dataList = [];

    const createCell = (row, col, value) => {
        const cell = document.createElement("td");
        cell.addEventListener('contextmenu', contextHandler);
        cell.addEventListener('click', openHandler);
        cell.setAttribute("id",(row*10)+(col+1));
        if(value === "m"){
            cell.setAttribute("class","mine");
        }
        cell.textContent = value;
        return cell
    }

    const setMinePosition = (mines, table_size) => {
        const list = [];
        const row_by_col = table_size * table_size;
        const list_temp = Array(row_by_col).fill(0).map( (e, i ) => i + 1);
        for(let j = 0 ; j < mines ; j++){
            list.push( list_temp.splice( parseInt( Math.random() * list_temp.length ) , 1).join() );
        }
        return list.map(n=>parseInt(n));
    }

    const initialDataList = (table_size, mines_position) => {
        for(let row = 0 ; row < table_size ; row++){
            const row_arr = []
            for(let col = 0 ; col < table_size ; col++){
                let current_position = (row*10) + (col+1)
                if(mines_position.includes( parseInt(current_position) )){
                    row_arr.push("m");
                }else{
                    row_arr.push("x");
                }
            }
            dataList.push(row_arr);
        }
        return dataList;
    }

    const drawingTable = (mains, table_size) => {
        const mines_position = setMinePosition(mains,table_size);
        const data_list = initialDataList(table_size, mines_position);
        data_list.forEach( (row, i)  => {
            const tr = main_table.appendChild(document.createElement("tr"));
            row.forEach( ( col, j)=> {
                tr.appendChild(createCell(i, j, "x"))
            });
        });
    }

    //zeroController
    const zeroController = (row, col) =>{
        const table = document.querySelector("table");
        const len = dataList.length;
        let near_mines = [];
        if(row + 1 >= len){
            near_mines = [
                table.children[row-1].children[col-1],table.children[row-1].children[col],table.children[row-1].children[col+1],
                table.children[row].children[col-1],table.children[row].children[col+1]
            ]
        }else if(row - 1 <= 0){
            near_mines = [
                table.children[row].children[col-1],table.children[row].children[col+1],
                table.children[row+1].children[col-1],table.children[row+1].children[col],table.children[row+1].children[col+1]
            ]
        }else{
            near_mines = [
                table.children[row-1].children[col-1],table.children[row-1].children[col],table.children[row-1].children[col+1],
                table.children[row].children[col-1],table.children[row].children[col+1],
                table.children[row+1].children[col-1],table.children[row+1].children[col],table.children[row+1].children[col+1]
            ]
        }
        near_mines.filter(v=> !!v).forEach(cell => {
            //console.log(dataList[row][col])
            if(dataList[row][col] !== "o"){
                cell.click()
            } 
        })
    }
    //getHowManyNearMines
    const getHowManyNearMines = (row, col) => {
        const len = dataList.length;
        let near_mines = []
        if(row + 1 >= len){
            near_mines = [
                dataList[row-1][col-1],dataList[row-1][col],dataList[row-1][col+1],
                dataList[row][col-1],dataList[row][col+1]
            ].filter(c=>c === "m");
        }else if(row - 1 <= 0){
            near_mines = [
                dataList[row][col-1],dataList[row][col+1],
                dataList[row+1][col-1],dataList[row+1][col],dataList[row+1][col+1]
            ].filter(c=>c === "m");
        }else{
            near_mines = [
                dataList[row-1][col-1],dataList[row-1][col],dataList[row-1][col+1],
                dataList[row][col-1],dataList[row][col+1],
                dataList[row+1][col-1],dataList[row+1][col],dataList[row+1][col+1]
            ].filter(c=>c === "m");
        }
        return near_mines.length;
    }
    //getCurrentPosition
    const getCurrentPosition = (e) => {
        const id = e.currentTarget.id;
        const target = document.getElementById(id);        
        const col = ( ( id%10 - 1 ) < 0 ? 9 : id%10 - 1 );
        const row = ( col === 9 ) ? parseInt(id/10) - 1 : parseInt(id/10);
        return {col,row};
    }
    //context
    const contextHandler = (e) => {
        e.preventDefault();
        const {col, row} = getCurrentPosition(e);
        if(dataList[row][col] !== "o"){
            if(e.currentTarget.textContent === "m" || e.currentTarget.textContent === "x"){
                e.currentTarget.textContent = "∮";
                e.currentTarget.setAttribute("class","context");
            }else if(e.currentTarget.textContent === "∮") {
                e.currentTarget.textContent = "?";
                e.currentTarget.setAttribute("class","context");
            }else{
                e.currentTarget.setAttribute("class","");
                e.currentTarget.textContent = "x";        
            }
        }
    }
    
    //openHandler
    const openHandler = (e) => {
        e.currentTarget.classList.add("clicked");
        const {col, row} = getCurrentPosition(e);
        if(dataList[row][col] === "m"){
            e.currentTarget.textContent = "Boom~"
            e.currentTarget.setAttribute("class","mine")
            setTimeout(() => {
                alert("지뢰가 터졌습니다....");
                window.location.reload();
            },1000)
        }else{
            const len = getHowManyNearMines(row, col);
            if(len === 0){
                e.currentTarget.textContent = ""
               zeroController(row, col);
            }else{
                e.currentTarget.textContent = len;
            }
            dataList[row][col] = "o";
        }

        if(!dataList.join().includes("x")){
            alert("지뢰를 다 찾았습니다");
            window.location.reload();
        }
        
        
    }


    const init = () => {   
        //지뢰 갯수, 테이블 사이즈     
        drawingTable(10,10);
    }
    if(main){
        init();
    }
})();
