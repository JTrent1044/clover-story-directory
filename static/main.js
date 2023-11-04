//This file really needs to be refactored at some point.

function capitalizeFirst(word){
    return word.charAt(0).toUpperCase() + word.substring(1);
}

function generateTableHeadElement(label){
    let th = document.createElement("th");
    let text = document.createTextNode(label);
    th.appendChild(text);
    return th
}

function generateTableHead(table) {
    let thead = table.createTHead();
    let row = thead.insertRow();

    //Add an empty header for the expander column.
    let expandcol = document.createElement("th");
    expandcol.appendChild(document.createTextNode(""))
    expandcol.classList.add("filter-false","sorter-false");
    row.appendChild(expandcol);

    for (let key of ["Title","Author","Publication Date","In-Universe Date","World"]) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }

    //Add an empty header for the edit column.
    let editcol = document.createElement("th");
    editcol.appendChild(document.createTextNode(""));
    editcol.classList.add("filter-false","sorter-false");
    row.appendChild(editcol);
}

function addRowCell(row,content){
    let cell = row.insertCell();
    cell.appendChild(content);
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();

        let expander = document.createElement("a");
        expander.href = "#";
        expander.classList.add("toggle","expander-btn");
        let expanderSymbol = document.createElement("i");
        expanderSymbol.classList.add("fa-solid","fa-caret-right","expander-btn-symbol");
        expander.appendChild(expanderSymbol);

        let expanderCell = row.insertCell();
        expanderCell.rowSpan = 2;
        expanderCell.appendChild(expander);

        let title = document.createElement("a");
        title.href = element['link'];
        title.appendChild(document.createTextNode(element['title']));
        addRowCell(row,title);
        addRowCell(row,document.createTextNode(capitalizeFirst(element['author'])));
        addRowCell(row,document.createTextNode(element['post_date']));
        //TODO: update this to take from 'database' at some point.
        addRowCell(row,document.createTextNode(element['ic_date'])); //Need to get canon/timeline dates.
        addRowCell(row,document.createTextNode(element['world'].split('_').map(capitalizeFirst).join(" ")));
    
        let edit = document.createElement("a");
        edit.id = "edit-"+element["index"];
        edit.classList.add("edit-btn");
        let editSymbol = document.createElement("i");
        editSymbol.classList.add("fa-solid","fa-pen-to-square","edit-btn-symbol");
        edit.appendChild(editSymbol);
        addRowCell(row,edit);

        let expansion = table.insertRow();
        expansion.classList.add("tablesorter-childRow");
        let expansionCol = expansion.insertCell();
        expansionCol.colSpan = 6; //Number of rows minus 1 (7-1=6 in this case.) Maybe automate this somehow?

        let expansionTitle = document.createElement("h3");
        expansionTitle.append(element['title'] + ", a " + element['world'].split('_').map(capitalizeFirst).join(" ") + " story by " + capitalizeFirst(element['author']));
        let expansionSummary = document.createElement("div");
        //TODO: update this to take from data elements at some point. (Moot at the moment as they're all empty.)
        //element['summary']
        expansionSummary.append("Summaries will eventually go here (They aren't here already because they don't exist. People need to write them.), and maybe more things as well. Nothing yet.");

        expansionCol.append(expansionTitle,expansionSummary);

    }
}

//index, title, author, link, post_date, ic_date, world, summary
//TO DO: remember to add entries for canon_date and summary in 'backend' as well.

function generateAddButton(){
    //Adding the button that allows adding stories.
    let addButton = document.createElement("button");
    addButton.id = "add-btn";
    let addButtonSymbol = document.createElement("i");
    addButtonSymbol.classList.add('fa-solid','fa-pen-to-square');
    addButtonSymbol.id = "add-btn-symbol";
    addButton.appendChild(addButtonSymbol);
    document.body.appendChild(addButton);

    //Placeholder for add button functionality.
    $("#add-btn").on("click", function(e){
        window.alert("Editor functionality is Not Yet Implemented.\nThere isn't a backend, so this doesn't work right now!");
    })
}

function linkEditorButtons(data){
    //Placeholder for making the editor buttons work. Replace hard-coded reference to 'stories' later.
    for (let element of data){
        $("#edit-"+element["index"]).on("click", function(e){
            window.alert("Editing " + element["title"] + "\nThere isn't a backend, so this doesn't work right now!");
        })
    }
    //Possibly look into 'editable' widget and things along those lines.
}

//This makes the sure everything is initialized only once the DOM has fully loaded.
//It mainly makes the tablesorter functionality work.
$(function() {
    generateTable($("table#stories_table")[0],stories.data);
    generateTableHead($("table#stories_table")[0]);
    generateAddButton()
    linkEditorButtons(stories.data)

    $(".tablesorter-childRow td").hide()

    $("#stories_table").tablesorter({
        theme:"default",
        sortList: [[2,0],[3,0]],
        widthFixed: true,
        widgets: ["zebra","filter","stickyHeaders","reflow"],
        widgetOptions: {
            filter_placeholder : { search : 'Filter here', select : '' }
        }
    });

    $('.tablesorter').delegate('.toggle', 'click' ,function() {
        $(this).closest('tr').nextUntil('tr.tablesorter-hasChildRow').find('td').toggle();
        return false;
    });
});