// Parsing files
// takes in an array of [question, options, answer] to make a MCQ object
class MCQ{
    constructor(mcq_arr){
        this.question = mcq_arr[0];
        this.options = mcq_arr[1];
        this.answer = mcq_arr[2];
    }
}

// takes an input of raw data from a text file, returns topic, array of MCQ objects for that topic
function parse(data){
    let ori_arr = data.split('\n');
    let new_line_regex = /\r?\n|\r/g;
    for(let i=0; i<ori_arr.length; i++){
        ori_arr[i] = ori_arr[i].replace(new_line_regex, '');
    }
    let topic = ori_arr[0];
    ori_arr = ori_arr.splice(1);
    let list_of_q = [];
    for(let i=0; i<ori_arr.length; i += 7){
        let question, options, answer;
        // setting q = 0 offset, options = 1 - 4 offset, a = 5 offest, del last line
        question = ori_arr[i];
        options = ori_arr.slice(i+1, i+5);
        answer = parseInt(ori_arr[i+5]);
        // push as 1 arr into an arr
        list_of_q.push(new MCQ([question, options, answer]));
    }
    return [topic, list_of_q];
}

// Loading the js text from html script
let arr_of_text = [topic_1_unparsed, topic_2_unparsed, topic_3_unparsed];

// parsing the strings
let topics = [];
let questions = [];
for(let i=0; i<arr_of_text.length; i++){
    let topics_and_question = parse(arr_of_text[i]);
    topics.push(topics_and_question[0]);
    questions.push(topics_and_question[1]);
}