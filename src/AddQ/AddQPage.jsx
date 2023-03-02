// import styles from './moudle/addQPage.module.css';
import '../moudle/addQPage.css';
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function AddQPage() {
  const { uid } = useParams();
  //   const [date, setDate] = useState((+new Date()).toString());
  const [formContent, setFormContent] = useState([]);
  const [onEditTitle, setOnEditTitle] = useState(false);
  const [onEditTitleLable, setOnEditTitleLable] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [textField, setTextField] = useState('');
  const [editedField, setEditedField] = useState(false);
  const date = (+new Date()).toString();

  // Form title
  const FormTitle = {
    user: { uid },
    title: '未命名表單',
  };
  const [formTitleContent, setFormTitleContent] = useState([FormTitle]);
  const FormLabel = {
    user: { uid },
    label: '表單說明',
  };
  const [formLabelContent, setFormLabelContent] = useState([FormLabel]);

  const editFormTitle = (value) => {
    FormTitle.title = value;
    setFormTitleContent([FormTitle]);
  };
  const editFormLable = (value) => {
    FormLabel.label = value;
    setFormLabelContent([FormLabel]);
  };

  // 增加題數
  const addQuestion = () => {
    const RandomNumber = Math.floor(Math.random() * 1000);
    const field = {
      name: RandomNumber,
      label: '題目說明',
      question_type: 'short_answer', // "paragraph","multichoice","more_than_one","drop_down"
      list: [],
    };
    setFormContent([...formContent, field]);
  };
  // 編輯題目說明
  const editField = (fieldName, fieldValue) => {
    const formFileds = [...formContent];
    const fieldChosedIndex = formFileds.findIndex((f) => f.name === fieldName);
    if (fieldChosedIndex > -1) {
      formFileds[fieldChosedIndex].label = fieldValue;
      setFormContent(formFileds);
    }
  };
  // 切換題型
  const editFieldType = (fieldName, fieldValue) => {
    const formFileds = [...formContent];
    const fieldChosedIndex = formFileds.findIndex((f) => f.name === fieldName);
    if (fieldChosedIndex > -1) {
      formFileds[fieldChosedIndex].question_type = fieldValue;
      setFormContent(formFileds);
    }
  };
  // 題型單選。建立選項
  const addFieldOption = (fieldName, fieldValue) => {
    const formFileds = [...formContent];
    const fieldChosedIndex = formFileds.findIndex((f) => f.name === fieldName);
    if (fieldChosedIndex > -1) {
      if (fieldValue !== '') {
        formFileds[fieldChosedIndex].list.push(fieldValue);
        setFormContent(formFileds);
        setTextField('');
        document.getElementById(`input${fieldName}`).value = '';
      }
    }
  };
  // 刪除radio選項(單選題)
  const delRadio = (fieldName, item) => {
    const formFileds = [...formContent];
    const field = formFileds.filter((index) => index.name === fieldName)[0]; // 目標field
    const arr = field.list.filter((index) => index !== item); // 目標field的list中找出不要的item，返回一個新的list
    for (let i = 0; i < formFileds.length; i += 1) {
      if (formFileds[i].name === fieldName) {
        formFileds[i].list = arr;
      }
    }
    setFormContent(formFileds);
  };
  // 刪除問題
  const delQuestion = (fieldName) => {
    const formFileds = [...formContent];
    const newformFileds = formFileds.filter((index) => index.name !== fieldName);
    setFormContent(newformFileds);
  };
  // 儲存表單到firebase
  const creatUserFrom = () => {
    const preview = document.getElementById('addQ_preview');
    const { title } = formTitleContent[0];
    setDoc(doc(db, uid, date), {
      name: title,
      html: preview.outerHTML,
    });
  };

  return (
    <>
      <div className="addQ_background">
        <div className="addQ_title">
          {formTitleContent.map((formTitle) => (
            <div>
              {onEditTitle ? (
                <input
                  key={formTitle.user}
                  className="addQ_title_input"
                  type="text"
                  value={formTitle.title}
                  onChange={(e) => editFormTitle(e.target.value)}
                  onBlur={() => {
                    setOnEditTitle(false);
                  }}
                />
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className="addQ_title_input"
                  onClick={() => {
                    setOnEditTitle(true);
                  }}
                  onKeyDown={() => {
                    setOnEditTitle(true);
                  }}
                >
                  {formTitle.title}
                </div>
              )}
            </div>
          ))}
          {formLabelContent.map((formLabel) => (
            <div>
              {onEditTitleLable ? (
                <textarea
                  className="addQ_intr_input"
                  rows={4}
                  value={formLabel.label}
                  onChange={(e) => editFormLable(e.target.value)}
                  onBlur={() => {
                    setOnEditTitleLable(false);
                  }}
                />
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className="addQ_intr_input"
                  onClick={() => {
                    setOnEditTitleLable(true);
                  }}
                  onKeyDown={() => {
                    setOnEditTitleLable(true);
                  }}
                >
                  {formLabel.label}
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className="addQ_addpreset_btn"
          onClick={() => addQuestion()}
          onKeyDown={() => addQuestion()}
          role="button"
          tabIndex={0}
          aria-label="增加問題"
        />
        <div className="addQ_preset_container">
          {formContent.map((field) => (
            <div key={field.name} id={field.name} className="addQ_main">
              <div className="addQ_preset">
                <div className="addQ_preset_title">
                  {onEdit && editedField === field.name ? (
                    <textarea
                      rows={4}
                      cols={50}
                      value={field.label}
                      onChange={(e) => editField(field.name, e.target.value)}
                      onBlur={() => {
                        setOnEdit(false);
                        setEditedField('');
                      }}
                    />
                  ) : (
                    <div
                      role="button"
                      tabIndex={0}
                      className="addQ_preset_title_label"
                      onClick={() => {
                        setOnEdit(true);
                        setEditedField(field.name);
                      }}
                      onKeyDown={() => {
                        setOnEdit(true);
                        setEditedField(field.name);
                      }}
                    >
                      {field.label}
                    </div>
                  )}
                </div>
                <div>
                  <select
                    className="addQ_preset_select"
                    onChange={(e) => editFieldType(field.name, e.target.value)}
                  >
                    <option value="short_answer">簡答題</option>
                    <option value="paragraph">問答題</option>
                    <option value="drop_down">下拉式選單</option>
                    <option value="multichoice">單選題</option>
                    <option value="more_than_one">多選題</option>
                  </select>
                </div>
              </div>
              <div>
                {field.question_type === 'short_answer' && (
                  <input type="text" className="addQ_preset_ans_text" placeholder={field.label} />
                )}
                {field.question_type === 'paragraph' && (
                  <textarea rows={4} className="addQ_preset_ans_text" placeholder={field.label} />
                )}
                {field.question_type === 'drop_down' && (
                  <div>
                    <select className="addQ_preset_ans_select">
                      {field.list.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    建立選項
                    <div>
                      <input
                        id={`input${field.name}`}
                        type="text"
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="輸入你的選項"
                      />
                      <button
                        type="button"
                        onClick={() => addFieldOption(field.name, textField)}
                        onKeyDown={() => addFieldOption(field.name, textField)}
                      >
                        建立
                      </button>
                    </div>
                  </div>
                )}
                {field.question_type === 'multichoice' && (
                  <>
                    {field.list.map((item) => (
                      <div className="addQ_radio">
                        <input type="radio" name={`input${field.name}`} value={item} />
                        <div>{item}</div>
                        <div
                          className="addQ_radio_del_btn"
                          onClick={() => delRadio(field.name, item)}
                          aria-label="刪除"
                          role="button"
                          tabIndex={0}
                          onKeyDown={() => delRadio(field.name, item)}
                        />
                      </div>
                    ))}
                    <div>
                      <input type="radio" disabled="true" />
                      <input
                        id={`input${field.name}`}
                        type="text"
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="輸入內容來建立選項(單選題)"
                      />
                      <button
                        type="button"
                        onClick={() => addFieldOption(field.name, textField)}
                        onKeyDown={() => addFieldOption(field.name, textField)}
                      >
                        建立
                      </button>
                    </div>
                  </>
                )}
                {field.question_type === 'more_than_one' && (
                  <>
                    {field.list.map((item) => (
                      <div className="addQ_checkbox">
                        <input type="checkbox" name={`input${field.name}`} value={item} />
                        <div>{item}</div>
                        <div
                          className="addQ_radio_del_btn"
                          onClick={() => delRadio(field.name, item)}
                          aria-label="刪除"
                          role="button"
                          tabIndex={0}
                          onKeyDown={() => delRadio(field.name, item)}
                        />
                      </div>
                    ))}
                    <div>
                      <input type="checkbox" disabled="true" />
                      <input
                        id={`input${field.name}`}
                        type="text"
                        onChange={(e) => setTextField(e.target.value)}
                        placeholder="輸入內容來建立選項(多選題)"
                      />
                      <button
                        type="button"
                        onClick={() => addFieldOption(field.name, textField)}
                        onKeyDown={() => addFieldOption(field.name, textField)}
                      >
                        建立
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div
                role="button"
                tabIndex={0}
                className="addQ_del_btn"
                onClick={() => delQuestion(field.name)}
                onKeyDown={() => delQuestion(field.name)}
                aria-label="刪除題目"
              />
            </div>
          ))}
        </div>
        <button type="button" className="addQ_creatQ_btn" onClick={() => creatUserFrom()}>
          <Link to={date}>建立表單</Link>
        </button>
      </div>
      {/* -------------------------------- 以下是表單預覽 -----------------------------*/}
      <div className="addQ_background addQ_preview" id="addQ_preview">
        <div className="addQ_title">
          {formTitleContent.map((formTitle) => (
            <div className="addQ_title_input">{formTitle.title}</div>
          ))}
          {formLabelContent.map((formLabel) => (
            <div className="addQ_intr_input">{formLabel.label}</div>
          ))}
        </div>
        <div className="addQ_preset_container">
          {formContent.map((field) => (
            <div key={field.name} id={field.name} className="addQ_main">
              <div className="addQ_preset">
                <div className="addQ_preset_title">
                  <div className="addQ_preset_title_label">{field.label}</div>
                </div>
              </div>
              {field.question_type === 'short_answer' && (
                <div id={`${field.name}short_answer`}>
                  <input type="text" className="addQ_preset_ans_text" placeholder={field.label} />
                </div>
              )}
              {field.question_type === 'paragraph' && (
                <div id={`${field.name}paragraph`}>
                  <textarea rows={4} className="addQ_preset_ans_text" placeholder={field.label} />
                </div>
              )}
              {field.question_type === 'drop_down' && (
                <div id={`${field.name}drop_down`}>
                  <select className="addQ_preset_ans_select">
                    {field.list.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {field.question_type === 'multichoice' && (
                <div id={`${field.name}multichoice`}>
                  {field.list.map((item) => (
                    <div className="addQ_radio">
                      <input type="radio" name={`input${field.name}`} value={item} />
                      <div>{item}</div>
                    </div>
                  ))}
                </div>
              )}
              {field.question_type === 'more_than_one' && (
                <div id={`${field.name}more_than_one`}>
                  {field.list.map((item) => (
                    <div className="addQ_checkbox">
                      <input type="checkbox" name={`input${field.name}`} value={item} />
                      <div>{item}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default AddQPage;
