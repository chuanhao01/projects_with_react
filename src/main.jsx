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
// now topics is an arr of topics [topic_1, topic_2, ..]
// questions are arr of mcq_obj [[mcq_obj]]
let topics = [];
let questions = [];
for(let i=0; i<arr_of_text.length; i++){
    let topics_and_question = parse(arr_of_text[i]);
    topics.push(topics_and_question[0]);
    questions.push(topics_and_question[1]);
}


class Quiz extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ori_mcqs: this.props.questions,
            topics: this.props.topics,
            states_of_child: {
                name_1: true,
                topic_2: false,
                quiz_3: false,
                summary_4: false, 
            },
            selected_questions: [],
        };
        this.getName = this.getName.bind(this);
        this.getTopic = this.getTopic.bind(this);
    }
    getName(name){
        this.setState({
            name: name,
            states_of_child: {
                name_1: false,
                topic_2: true,
            },
        });
    }
    getTopic(selected_choice){
        let selected_topic = this.state.topics[selected_choice-1];
        let selected_questions = this.state.ori_mcqs[selected_choice-1];
        this.setState({
            selected_topic: selected_topic,
            selected_questions: selected_questions,
            states_of_child: {
                topic_2: false,
                quiz_3: true,
            }
        });
    }
    render(){
        let state_of_quiz_3 = this.state.states_of_child.quiz_3;
        let quiz_obj;
        if(state_of_quiz_3){
            quiz_obj = <GetQuiz_3 questions={this.state.selected_questions} state_to_show={this.state.states_of_child.quiz_3} />;
        }
        return (
            <div>
                <GetName_1 state_to_show={this.state.states_of_child.name_1} callback_when_done={this.getName} />
                <GetTopic_2 state_to_show={this.state.states_of_child.topic_2} name={this.state.name} topics={this.state.topics} callback_when_done={this.getTopic} />
                {quiz_obj}
            </div>
        );
    }
}

class GetName_1 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            input: '',
            check_input: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        let current_value = event.target.value;
        if(current_value !== ''){
            this.setState({
                input: current_value,
                check_input: true,
            });
        }else{
            this.setState({
                check_input,
            });
        }
    }
    handleSubmit(event){
        event.preventDefault();
        this.props.callback_when_done(this.state.input);
    }
    render(){
        let check_state = this.props.state_to_show;
        if(check_state){
            return (
                <div className='container-fluid getName'>
                    <h2 className='row'>Welcome to the Quiz</h2>
                    <form onSubmit={this.handleSubmit} className='row container-fluid'>
                        <div className='row mb-3'>
                            <label className='mr-2' for='name'>Name: </label>
                            <input id='name' value={this.state.input} onChange={this.handleChange}></input>
                        </div>
                        <div className="w-100"></div>
                        <input className='row' type='submit' value='Submit' disabled={!this.state.check_input}></input>
                    </form>
                </div>
            );
        }
        else{
            return null;
        }
    }
}

class GetTopic_2 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            input: '',
            check_input: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        let current_value = event.target.value;
        if(parseInt(current_value) > 0 && parseInt(current_value) < this.props.topics.length + 1){
            this.setState({
                input: current_value,
                check_input: true,
            });
        }
        else{
            this.setState({
                input: current_value,
                check_input: false,
            });
        }
    }
    handleSubmit(event){
        event.preventDefault();
        this.props.callback_when_done(parseInt(this.state.input));
    }
    render(){
        let check_state = this.props.state_to_show;
        let topics = this.props.topics.slice();
        let name = this.props.name;
        let list_of_topics = topics.map((topic, index) => 
            <li key={index}>
                ({index + 1}) {topic}
            </li>
        )
        if(check_state){
            return (
                <div className='container-fluid'>
                    <h2 className='row'>Hey {this.props.name}, what topic would you like?</h2>
                    <ul>
                        {list_of_topics}
                    </ul>
                    <form className='container-fluid row' onSubmit={this.handleSubmit}>
                        <div className='row mb-3'>
                            <label for='topic' className='mr-3'>>></label>
                            <input id='topic' value={this.state.input} onChange={this.handleChange}></input>
                        </div>
                        <div className="w-100"></div>
                        <input className='row' type='submit' value='Submit' disabled={!this.state.check_input} ></input>
                    </form>
                </div>
            );
        }
        else{
            return null;
        }
    }
}

class GetQuiz_3 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user_answers: new Array(this.props.questions.length).fill(null),
            questions: this.props.questions,
            show_questions: true,
            show_checks: false,
            current_index: 0,
        };
        this.handleUserInput = this.handleUserInput.bind(this);
    }
    handleUserInput(user_input){
        let current_index = this.state.current_index;
        let questions = this.state.questions;
        if(user_input === 'N'){
            this.setState({
                current_index: this.state.current_index + 1,
            });
        }
        else if(user_input === 'P'){
            this.setState({
                current_index: this.state.current_index - 1,
            });
        }
        else{
            let answers = this.state.user_answers.slice();
            answers[current_index] = [user_input, questions[current_index].options[user_input-1]]; 
            this.setState({
                user_answers: answers,
                current_index: current_index + 1,
            });
        }
        if(current_index >= this.state.user_answers){
            this.setState({
                show_questions: false,
                show_checks: true,
            });
        }
    }
    handleCheckInput(user_input){

    }
    render(){
        let check_state = this.props.state_to_show;
        let show_questions = this.state.show_questions;
        let show_checks = this.state.show_checks;
        console.log(this.state.user_answers);
        if(check_state){
            if(show_questions){
                return( 
                    <div>
                        <Question state_to_show={this.state.show_questions} index={this.state.current_index} question={this.state.questions[this.state.current_index]} callback_when_done={this.handleUserInput} />
                        <CheckAnswers state_to_show={this.state.show_checks} questions={this.state.questions} user_answers={this.state.user_answers} callback_when_done={this.handleCheckInput} />
                    </div>
                );
            }
        }
        else{
            return null;
        }
    }
}

class Question extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            input: '',
            check_input: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        let options = this.props.question.options;
        let value = event.target.value;
        let index = this.props.index;
        if(index === 0){
            if(value === 'N' || (value > 0 && value < options.length + 1)){
                this.setState({
                    input: value,
                    check_input: true,
                });
            }
            else{
                this.setState({
                    input: value,
                    check_input: false,
                });
            }
        }
        else{
            if(value === 'N' || (value > 0 && value < options.length + 1) || value === 'P'){
                this.setState({
                    input: value,
                    check_input: true,
                });
            }
            else{
                this.setState({
                    input: value,
                    check_input: false,
                });
            }
        }
    }
    handleSubmit(event){
        event.preventDefault();
        let value = this.state.input;
        if(parseInt(value) === NaN){
            this.props.callback_when_done(value);
        }
        else{
            value = parseInt(value);
            this.props.callback_when_done(value);
        }
        this.setState({
            input: '',
            check_input: false,
        });
    }
    render(){
        let check_state = this.props.state_to_show;
        let index = this.props.index;
        let question = this.props.question;
        let options = question.options;
        let num_of_options = options.length;
        let options_objs = options.map((option, index) => 
            <li key={index}>
                {option}
            </li>
        );
        if(check_state){
            if(index === 0){
                return (
                    <div className='container-fluid'>
                        <h2 className='row'>Question {index + 1}: {question.question}</h2>
                        <ul>
                            {options_objs}
                        </ul>
                        <div className="w-100"></div>
                        <p>&#60;enter 1 to {num_of_options} to answer or N for the next question&#62;</p>
                        <form className='container-fluid row' onSubmit={this.handleSubmit}>
                            <div className='row mb-1'>
                                <label for='option' className='mr-3'>>></label>
                                <input type='text' id='option' value={this.state.input} onChange={this.handleChange}></input>
                            </div>
                            <div className="w-100"></div>
                            <input type='submit' value='Submit' className='row' disabled={!this.state.check_input}></input>
                        </form>
                    </div>
                );
            }
            else{
                return (
                    <div className='container-fluid'>
                        <h2 className='row'>Question {index + 1}: {question.question}</h2>
                        <ul>
                            {options_objs}
                        </ul>
                        <p>&#60;enter 1 to {num_of_options} to answer, P for the previous question, N for the next question&#62;</p>
                        <form className='container-fluid row' onSubmit={this.handleSubmit}>
                            <div className='row mb-1'>
                                <label for='option' className='mr-3'>>></label>
                                <input type='text' id='option' value={this.state.input} onChange={this.handleChange}></input>
                            </div>
                            <div className="w-100"></div>
                            <input type='submit' value='Submit' className='row' disabled={!this.state.check_input}></input>
                        </form>
                    </div>
                );  
            }
        }
        else{
            return null;
        }
    }
}

//bugged out
class CheckAnswers extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            questions: this.props.questions,
        };
    }
    render(){
        let check_state = this.props.state_to_show;
        let questions = this.state.questions;
        if(check_state === false){
            this.setState({
                user_answers: this.props.user_answers,
            });
        }
        let user_answers = this.state.user_answers;
        let questions_and_answers_to_show = questions.map((question, index) => {
            <li key={index}>
                <p>{question.question}</p>
                <p>Your Answer: ({user_answers[index][0]}) {user_answers[index][1]}</p>
            </li>
        });
        if(check_state){
            return (
                <div className='container-fluid'>

                </div>
            );
        }
        else{
            return null;
        }
    }
}

ReactDOM.render(
    <Quiz questions={questions} topics={topics} />, document.getElementById('root')
);