import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import md5 from '../../lib/md5.js';
import './style.css';
import html2canvas from 'html2canvas';
class Scoring extends Component {
    constructor(props) {
        super(props);
        this.state = { img: null };
        this.score = '';
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        let _this = this;
        html2canvas(document.getElementById('root'), {
            onrendered: (canvas) => {
                let url = canvas.toDataURL();
                _this.setState({ img: url });
            }
        });
    }
    componentWillReceiveProps(nextprops){
        if(nextprops && nextprops.clearShot ===true && this.state.img){
            this.setState({img:null})
        }
    }
    componentDidUpdate(nextprops){
        !this.state.img && this.onClick();
    }
    render() {
        let m = getMsg();
        let { score } = this.props;
        return (
            <div>
                {this.state.img ? <img className="downImg" src={this.state.img} alt="长按下载" />: undefined}
                <div className="scoreContent">
                    {score ?
                        <div className="desc">
                            <div>你的容颜在全球所有人和动物中排名</div>
                            <div className="score">{score} 名</div>
                            <div>{m}!</div>
                            <div className="tips">长按保存图片分享</div>
                        </div>
                        : undefined
                    }
                    <div>
                        <img src="url.png" className="url" alt="二维码" />
                    </div>
                </div>
            </div>
        )
    }
}
const msg = ['或许靠能力也是一种选择，不要放弃你', '你以为躲起来就找不到你了吗？没有用的你是那样拉风的人', '那么丑你还是别出来见人了', '妹子不错哟想约的快扫下方二维码', '把你丢在猪群里 都找不到你了', '人群中一眼就看出了你是头猪', '地球很危险快回火星'];
const getMsg = () => {
    return msg[Math.floor(Math.random() * msg.length)];
}

const mapStateToProps = (state) => {
    let base64 = state.img;
    if (base64) {
        let score = '';
        let md5value = md5(base64);
        let sublen = parseInt(md5value.substr(0, 1), 16);
        sublen = Math.max(1, Math.min(8, sublen));
        md5value = md5value.substr(0, sublen);
        score = parseInt(md5value, 16);
        return {
            score: toThousands(score),
            clearShot:state.scoreborad.clearShot
        }
    } else { 
        return {
            score: '',
            clearShot:state.scoreborad.clearShot
        }
    }
}
const toThousands = (num) => {
    num = (num || 0).toString();
    let result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}
export default connect(mapStateToProps, null)(Scoring)