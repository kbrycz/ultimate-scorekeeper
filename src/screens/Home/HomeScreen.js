import React from 'react'
import {View, StyleSheet, Text, Dimensions, TouchableOpacity, Share, Linking, Image} from 'react-native'
import * as Color from '../../../global/Color'
import SimpleModalComponent from '../../components/SimpleModalComponent'
import CircleComponent from '../../components/CircleComponent';
import { Feather } from '@expo/vector-icons'; 



class HomeScreen extends React.Component {

    constructor() {
        super()
        this.state = {
            text: '',
            modalVisible: false
        }
    }

    // Lets users share the app with other people
    shareButton = async () => {
        console.log("share")
        try {
            const result = await Share.share({
                url: 'https://apps.apple.com/us/app/the-ultimate-scorekeeper/id6446509225',
            });

        } 
        catch (error) {
            this.setState({
                text: 'Unable to share app. Please try again!',
                modalVisible: true,
            })
        }
    }

    // Sends the user to the app store to rate the app
    rateApp = async () => {
        console.log("rate app")
        Linking.openURL('https://apps.apple.com/us/app/the-ultimate-scorekeeper/id6446509225');
    }

    // Sets the status of simple modal
    setModalVisible = (isVisible) => {
        this.setState({modalVisible: isVisible})
    }

    render() {
        return (
            <View style={styles.background}>
                <CircleComponent isWhite={false} />
                <Text style={styles.headerText}>The Ultimate Scorekeeper</Text>
                <View>
                    <Image
                        style={styles.image} 
                        source={require('../../../assets/main.png')}
                        />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Type')}>
                    <Text style={styles.buttonText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.howToPlay} onPress={() => this.props.navigation.navigate('Previous')}>
                    <Text style={styles.howToPlayText}>History</Text>
                </TouchableOpacity>
                <View style={styles.iconView}>
                    <TouchableOpacity onPress={this.shareButton}>
                        <Feather name="share-2" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.rateApp}>
                        <Feather name="star" style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('About')}>
                        <Feather name="info" style={styles.icon}/>
                    </TouchableOpacity>
                </View>
                <SimpleModalComponent modalVisible={this.state.modalVisible} 
                                      setModalVisible={this.setModalVisible} 
                                      text={this.state.text} buttonText={'OK'} />
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: Color.MAIN,
        height: Dimensions.get('window').height
    },
    headerText: {
        marginTop: Dimensions.get('window').height * .15,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        lineHeight: Dimensions.get('window').height * .08,
        fontSize: Dimensions.get('window').height * .06,
        textAlign: 'center',
        color: '#fff',
        opacity: .8,
        fontFamily: 'BalsamiqSans'
    },
    image: {
        height: Dimensions.get('window').height * .2,
        width: Dimensions.get('window').width * .5,
        marginHorizontal: Dimensions.get('window').width * .25,
        marginVertical: Dimensions.get('window').height * .07,
        resizeMode: 'contain'
    },
    buttonText: {
        fontSize: Dimensions.get('window').height * .032,
        textAlign: 'center',
        color: Color.MAIN,
        fontFamily: 'BalsamiqSans'
    },
    button: {
        width: Dimensions.get('window').width * .7,
        marginLeft: Dimensions.get('window').width * .15,
        marginRight: Dimensions.get('window').width * .15,
        backgroundColor: '#fff',
        paddingVertical: Dimensions.get('window').width * .05,
        paddingHorizontal: Dimensions.get('window').width * .07,
        borderWidth: 4,
        borderColor: Color.MAIN,
        borderRadius: 20,
    },
    howToPlayText: {
        fontSize: Dimensions.get('window').height * .022,
        textAlign: 'center',
        color: '#fff',
        fontFamily: 'BalsamiqSans'
    },
    howToPlay: {
        marginTop: Dimensions.get('window').height * .02,
        width: Dimensions.get('window').width * .7,
        marginLeft: Dimensions.get('window').width * .15,
        marginRight: Dimensions.get('window').width * .15,
        paddingVertical: Dimensions.get('window').width * .05,
        paddingHorizontal: Dimensions.get('window').width * .07,
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 15,
    },
    iconView: {
        marginTop: Dimensions.get('window').height * .04,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    icon: {
        color: '#fff',
        marginHorizontal: Dimensions.get('window').width * .04,
        fontSize: Dimensions.get('window').height * .03,
    },
})

export default HomeScreen
