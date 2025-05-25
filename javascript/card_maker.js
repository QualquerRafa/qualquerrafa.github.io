function populate_cards(){
    for (let i=0; i < Object.keys(projects).length; i++){
        let proj_id = Object.keys(projects)[i]
        let proj_data = projects[proj_id]
        console.log(proj_data)

        create_card(proj_data)
    }
}

function create_card(project_loaded_data){
    let project_indentifier = project_loaded_data.img
    let template = `
    <div class="project-card"><a id="proj-url_${project_indentifier}" href="">
        <div class="project-image">
            <img id="proj-img_${project_indentifier}" src="images/permitted-memories.png" style="width: 100%;">
        </div>

        <div class="project-identifier">
            <div id="proj-title_${project_indentifier}" class="project-title">Titulo de Projeto</div>
            <div id="proj-status_${project_indentifier}" class="project-status">Status</div>
        </div>

        <div id="proj-description_${project_indentifier}" class="project-description">
            Descrição breve do projeto, poucas linhas, palavras chave, dá pra preencher mais um pouco. Três linhas parece ideal.
        </div>
        
        <div class="project-tags">
            <div id="tag1_${project_indentifier}" class="tag">tag1</div>
            <div id="tag2_${project_indentifier}" class="tag">tag2</div>
            <div id="tag3_${project_indentifier}" class="tag">tag3</div>
            <div id="tag4_${project_indentifier}" class="tag">tag4</div>
        </div>
    </div>
    `;

    //Initialize information about project at looping index
    let card_image = project_loaded_data.img
    let card_url = project_loaded_data.url
    let card_title = project_loaded_data.title
    let card_status = project_loaded_data.status
    let card_description = project_loaded_data.description
    let card_tags_array = project_loaded_data.tags

    //Create wrapper div with ID first
    var wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'project_' + project_indentifier)
    wrapper.innerHTML = template
    //Add to HTML body, inside 'projects_containter'
    document.getElementById("projects_container").append(wrapper)
   
    //Visually sUpdate with information about each project
    document.getElementById("proj-img_" + project_indentifier).src = "images/"+ card_image +".png"
    document.getElementById("proj-title_" + project_indentifier).innerHTML = card_title
    document.getElementById("proj-url_" + project_indentifier).href = card_url
    
    document.getElementById("proj-status_" + project_indentifier).innerHTML = card_status
    let color = ""
    switch (card_status){
        case "Abandonado": color = "red"; break;
        case "Completo": color = "green" ; break;
        default: color = "#edc511"; break;
    }
    document.getElementById("proj-status_" + project_indentifier).style.backgroundColor = color;
   
    if(card_description != "") {
        document.getElementById("proj-description_" + project_indentifier).innerHTML = card_description
    }

    for (let i=0; i < card_tags_array.length; i++){
        //Deal with certain special cases
        switch (card_tags_array[i]) {
            case "": //Hidle invisible tags
                document.getElementById("tag"+ (i+1).toString() +"_" + project_indentifier).style.display = 'none';
                break;
            case "Godot":
                document.getElementById("tag"+ (i+1).toString() +"_" + project_indentifier).style.backgroundColor = "#34648c";
                break;
            case "Javascript":
                document.getElementById("tag"+ (i+1).toString() +"_" + project_indentifier).style.backgroundColor = "#edc511";
                break;
            case "Lista":
                document.getElementById("tag"+ (i+1).toString() +"_" + project_indentifier).style.backgroundColor = "#009933";
                break;
            default: break;
        }

        document.getElementById("tag"+ (i+1).toString() +"_" + project_indentifier).innerHTML = card_tags_array[i]
    }
}
